<script lang="ts" setup>
import { useAuthStore } from '@/stores/modules/auth.module'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useForm, useToast } from 'vuestic-ui'
import { getErrorMessage } from '@/services/utils'
import { useReCaptcha } from 'vue-recaptcha-v3'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { validate } = useForm('form')
const { push } = useRouter()
const { init } = useToast()

const isLoading = ref(false)
const reCaptcha = useReCaptcha()

const formData = reactive({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  phoneNumber: '',
})
const store = useAuthStore()
const submit = async () => {
  isLoading.value = true
  if (validate()) {
    await reCaptcha?.recaptchaLoaded()
    const captchaToken = await reCaptcha?.executeRecaptcha('register')
    store
      .register(
        formData.fullName,
        formData.email,
        formData.password,
        formData.confirmPassword,
        formData.phoneNumber,
        captchaToken ?? '',
      )
      .then((response) => {
        init({
          message: response.data.message,
          color: 'success',
        })
        push({ name: 'login' })
      })
      .catch((error: any) => {
        init({
          message: getErrorMessage(error),
          color: 'danger',
        })
      })
      .finally(() => {
        isLoading.value = false
      })
  }
}

const passwordRules: ((v: string) => boolean | string)[] = [
  (v) => !!v || 'Password field is required',
  (v) => (v && v.length >= 8) || 'Password must be at least 8 characters long',
  (v) => (v && /[A-Za-z]/.test(v)) || 'Password must contain at least one letter',
  (v) => (v && /\d/.test(v)) || 'Password must contain at least one number',
  (v) => (v && /[!@#$%^&*(),.?":{}|<>]/.test(v)) || 'Password must contain at least one special character',
]

const fullnameRules: ((v: string) => boolean | string)[] = [
  (v) => !!v || 'Name field is required',
  (v) => (v && v.length >= 5) || 'Name must be at least 5 characters long',
  (v) => (v && v.length <= 50) || 'Name must be at most 50 characters long',
  (v) =>
    (v && /^[a-zA-ZÀ-ÿĂÂÊÔƠƯĐáàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵ\s]*$/i.test(v)) ||
    'Name must contain only letters',
]

const phoneNumberRules: ((v: string) => boolean | string)[] = [
  (v) => !!v || 'Phone Number field is required',
  (v) => (v && v.length >= 10) || 'Phone Number must be at least 10 characters long',
  (v) => (v && v.length <= 15) || 'Phone Number must be at most 15 characters long',
  (v) => (v && /^\d+$/.test(v)) || 'Phone Number must contain only numbers',
]

const emailRules: ((v: string) => boolean | string)[] = [
  (v) => !!v || 'Email field is required',
  (v) => /.+@.+\..+/.test(v) || 'Email should be valid',
]
</script>

<template>
  <VaInnerLoading :loading="isLoading" :size="60">
    <VaForm ref="form" @submit.prevent="submit">
      <h1 class="font-semibold text-4xl mb-4">{{ t('auth.sign_up') }}</h1>
      <p class="text-base mb-4 leading-5">
        {{ t('auth.have_account') }}
        <RouterLink :to="{ name: 'login' }" class="font-semibold text-primary">{{ t('auth.login') }}</RouterLink>
      </p>
      <VaInput
        v-model="formData.fullName"
        :rules="[(v: any) => !!v || t('auth_full_name_required'), ...fullnameRules]"
        class="mb-4"
        :label="t('auth.full_name')"
      />
      <VaInput v-model="formData.email" :rules="emailRules" class="mb-4" label="Email" type="email" />
      <VaValue v-slot="isPasswordVisible" :default-value="false">
        <VaInput
          ref="password1"
          v-model="formData.password"
          :rules="passwordRules"
          :type="isPasswordVisible.value ? 'text' : 'password'"
          class="mb-4"
          :label="t('auth.password')"
          :messages="t('auth.password_hint')"
          @clickAppendInner.stop="isPasswordVisible.value = !isPasswordVisible.value"
        >
          <template #appendInner>
            <VaIcon
              :name="isPasswordVisible.value ? 'mso-visibility_off' : 'mso-visibility'"
              class="cursor-pointer"
              color="secondary"
            />
          </template>
        </VaInput>
        <VaInput
          ref="password2"
          v-model="formData.confirmPassword"
          :rules="[
            (v) => !!v || t('auth.repeat_password_required'),
            (v) => v === formData.password || t('auth.password_match'),
          ]"
          :type="isPasswordVisible.value ? 'text' : 'password'"
          class="mb-4"
          :label="t('auth.repeat_password')"
          @clickAppendInner.stop="isPasswordVisible.value = !isPasswordVisible.value"
        >
          <template #appendInner>
            <VaIcon
              :name="isPasswordVisible.value ? 'mso-visibility_off' : 'mso-visibility'"
              class="cursor-pointer"
              color="secondary"
            />
          </template>
        </VaInput>
        <VaInput v-model="formData.phoneNumber" :rules="phoneNumberRules" class="mb-4" label="Phone Number" />
      </VaValue>

      <div class="flex justify-center mt-4">
        <VaButton class="w-full" @click="submit">{{ t('auth.create_account') }}</VaButton>
      </div>
    </VaForm>
  </VaInnerLoading>
</template>
