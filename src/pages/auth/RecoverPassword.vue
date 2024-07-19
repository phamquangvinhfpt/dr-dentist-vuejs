<template>
  <VaInnerLoading :loading="isLoading" :size="60">
    <VaForm ref="passwordForm" @submit.prevent="submit">
      <h1 class="font-semibold text-4xl mb-4">{{ t('auth.forgot_password') }}</h1>
      <p class="text-base mb-4 leading-5">
        {{ t('auth.forgot_password_description') }}
      </p>
      <VaInput v-model="email" :rules="emailRules" class="mb-4" :label="t('auth.enter_email')" type="email" />
      <VaButton class="w-full mb-2" @click="submit">{{ t('auth.send_password') }}</VaButton>
      <VaButton :to="{ name: 'login' }" class="w-full" preset="secondary" @click="submit">{{
        t('auth.go_back')
      }}</VaButton>
    </VaForm>
  </VaInnerLoading>
</template>

<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue'
import { useForm, useToast } from 'vuestic-ui'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/modules/auth.module'
import { getErrorMessage } from '../../services/utils'
import { useReCaptcha } from 'vue-recaptcha-v3'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const email = ref('')
const { push } = useRouter()
const form = useForm('passwordForm')
const router = useRouter()
const store = useAuthStore()
const { init } = useToast()

const isLoading = ref(false)
const reCaptcha = useReCaptcha()

const emailRules: ((v: string) => boolean | string)[] = [
  (v) => !!v || 'Email field is required',
  (v) => /.+@.+\..+/.test(v) || 'Email should be valid',
]

const submit = async () => {
  isLoading.value = true
  if (form.validate()) {
    await reCaptcha?.recaptchaLoaded()
    const captchaToken = await reCaptcha?.executeRecaptcha('forgot_password')
    store
      .forgotPassword(email.value, captchaToken ?? '')
      .then(() => {
        router.push({ name: 'recover-password-email' })
      })
      .catch((error) => {
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

onBeforeMount(() => {
  if (store.isAuthenticated) {
    push({ name: 'dashboard' })
    init({ message: 'You are already logged in', color: 'success', position: 'bottom-right' })
  }
})
</script>
