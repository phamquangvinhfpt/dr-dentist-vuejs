<template>
  <VaInnerLoading :loading="isLoading" :size="60">
    <VaForm ref="form" @submit.prevent="submit">
      <h1 class="font-semibold text-4xl mb-4">{{ t('auth.reset_password') }}</h1>
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
          v-model="formData.repeatPassword"
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
      </VaValue>
      <VaButton class="w-full" @click="submit">{{ t('auth.reset_password') }}</VaButton>
    </VaForm>
  </VaInnerLoading>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import { onBeforeMount, reactive } from 'vue'
import { useForm, useToast } from 'vuestic-ui'
import { useAuthStore } from '@/stores/modules/auth.module'
import { ref } from 'vue'
import { ResetPassword } from './types'
import { getErrorMessage } from '@/services/utils'
import { useReCaptcha } from 'vue-recaptcha-v3'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()
const { push } = useRouter()
const store = useAuthStore()

const { validate } = useForm('form')
const { init } = useToast()

const isLoading = ref(false)

const formData = reactive({
  email: '',
  password: '',
  repeatPassword: '',
  token: '',
})

const userEmail = route.query.Email as string
const token = route.query.Token as string
const reCaptcha = useReCaptcha()

const submit = async () => {
  isLoading.value = true
  if (validate()) {
    await reCaptcha?.recaptchaLoaded()
    const captcha = await reCaptcha?.executeRecaptcha('reset_password')
    const resetPasswordData: ResetPassword = {
      email: userEmail,
      token: token,
      newPassword: formData.password,
      confirmPassword: formData.repeatPassword,
      captchaToken: captcha ?? '',
    }
    store
      .resetPassword(resetPasswordData)
      .then(() => {
        init({
          title: 'Success',
          message: 'Password has been reset successfully',
          color: 'success',
        })
        push({ name: 'login' })
      })
      .catch((error) => {
        const message = getErrorMessage(error)
        init({
          title: 'Error',
          message: message,
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

onBeforeMount(() => {
  if (store.isAuthenticated) {
    push({ name: 'dashboard' })
    init({ message: 'You are already logged in', color: 'success', position: 'bottom-right' })
  }
})
</script>
