<script lang="ts" setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import {
  ChangeEmailFormData,
  ChangePhoneNumberFormData,
  PasswordDetailFormData,
  SettingProfile,
  UserDetailFormData,
  UserDetailsUpdate,
} from './types'
import { VaAvatar, useForm, useToast } from 'vuestic-ui'
import { useAuthStore } from '@/stores/modules/auth.module'
import { AvatarFiles, OTP } from './UserProfile.enum'
import { useUserProfileStore } from '@/stores/modules/user.module'
import { getErrorMessage } from '@/services/utils'

const props = defineProps({
  settingOption: {
    type: Object as () => SettingProfile | null,
    default: null,
  },
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { init: notify } = useToast()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const authStores = useAuthStore()
const userProfileStore = useUserProfileStore()
const isShowProfile = ref(true)
const OTPTime = ref(OTP.TimeOut)
const typesImage = ref(AvatarFiles.Type)
const isShowModal = ref({
  email: false,
  phoneNumber: false,
  removeAvatar: false,
})
const isShowChangePhoneOTP = ref(false)
const { validate, isValid } = useForm('form')
const {
  validate: validateChangePassword,
  isValid: isValidChangePassword,
  reset: resetChangePassword,
} = useForm('formChangePassword')
const { reset: resetChangeEmail } = useForm('formChangeEmail')
const { reset: resetChangePhone } = useForm('formChangePhone')
const { reset: resetChangePhoneOTP } = useForm('formChangePhoneOTP')
const userDetail = ref<UserDetailFormData>({
  fullName: '',
  dob: null,
  gender: null,
  email: '',
  phoneNumber: '',
  imageUrl: '',
})
const passwordDetail = ref<PasswordDetailFormData>({
  password: '',
  confirmNewPassword: '',
  newPassword: '',
})
const fileUploaded = ref(null)

const getUserDetail = async () => {
  try {
    await userProfileStore.getUserProfile()
    userDetail.value = {
      fullName: userProfileStore?.userDetails?.fullName,
      dob: userProfileStore?.userDetails?.birthDate,
      gender: userProfileStore?.userDetails?.gender,
      email: userProfileStore?.userDetails?.email,
      phoneNumber: userProfileStore?.userDetails?.phoneNumber,
      imageUrl: userProfileStore?.userDetails?.imageUrl,
    }
    Object.assign(formData, userDetail.value)
    authStores.updateAvatarUrl(userDetail.value.imageUrl ? userDetail.value.imageUrl : undefined)
  } catch (error) {
    console.error(error)
  }
}

watch(
  () => props.settingOption?.id,
  (id) => {
    const showProfile = id == '1'
    // if (showProfile) {
    //   getUserDetail()
    // }
    isShowProfile.value = showProfile
  },
  { immediate: true },
)

onMounted(() => {
  getUserDetail()
  isShowProfile.value = props.settingOption?.id == '1'
})

const formData = reactive({ ...userDetail.value })
const formDataChangePassword = reactive({ ...passwordDetail.value })
const formDataChangePhoneNumber = reactive({ phoneNumber: '', password: '' })
const formDataChangePhoneOTP = reactive({ otpCode: '' })
const formDataChangeEmail = reactive({ email: '', password: '' })

const phoneNumberRules: ((v: string) => boolean | string)[] = [
  (v) => !!v || 'Phone Number field is required',
  (v) => (v && v.length >= 10) || 'Phone Number must be at least 10 characters long',
  (v) => (v && v.length <= 15) || 'Phone Number must be at most 15 characters long',
  (v) => (v && /^\d+$/.test(v)) || 'Phone Number must contain only numbers',
]

const phoneOtpRules: ((v: string) => boolean | string)[] = [
  (v) => !!v || 'OTP code field is required',
  (v) => (v && v.length == 6) || 'OTP code must be 6 characters long',
  (v) => (v && /^\d+$/.test(v)) || 'OTP code must contain only numbers',
]

const emailRules: ((v: string) => boolean | string)[] = [
  (v) => !!v || 'Email field is required',
  (v) => /.+@.+\..+/.test(v) || 'Email should be valid',
]

const passwordRules: ((v: string) => boolean | string)[] = [
  (v) => !!v || 'Password field is required',
  (v) => (v && v.length >= 8) || 'Password must be at least 8 characters long',
  (v) => (v && /[A-Za-z]/.test(v)) || 'Password must contain at least one letter',
  (v) => (v && /\d/.test(v)) || 'Password must contain at least one number',
  (v) => (v && /[!@#$%^&*(),.?":{}|<>]/.test(v)) || 'Password must contain at least one special character',
]

const genderOptions = reactive([
  {
    text: 'male',
    value: 1,
  },
  {
    text: 'female',
    value: 0,
  },
])

const checkEmptyField = (value: any) => {
  if (value === null || value === undefined) return true
  if (typeof value === 'string' && value.trim() === '') return true
  return false
}
const isInValidField = (value: string, rules: any[]) => {
  return rules.some((rule) => typeof rule(value) === 'string')
}

const shortNameLetter = computed(() => userProfileStore?.userDetails?.fullName?.charAt(0).toUpperCase())

const isFormHasNotChanged = computed(() => {
  return Object.entries(userDetail.value).every(([key, value]) => {
    return (formData as { [key: string]: any })[key] === value
  })
})

const isDisabledButtonUpdateProfile = computed(() => {
  if (isFormHasNotChanged.value) return true
  else if (!isValid) return true
  else if (checkEmptyField(formData.fullName) || checkEmptyField(formData.dob) || checkEmptyField(formData.gender)) {
    return true
  }
  return false
})

const isDisabledButtonChangePassword = computed(() => {
  if (!isValidChangePassword.value) {
    return true
  } else if (
    checkEmptyField(formDataChangePassword.password) ||
    checkEmptyField(formDataChangePassword.confirmNewPassword) ||
    checkEmptyField(formDataChangePassword.newPassword)
  ) {
    return true
  }
  return false
})

const isDisabledButtonChangeEmail = computed(() => {
  if (
    isInValidField(formDataChangeEmail.email, emailRules) ||
    isInValidField(formDataChangeEmail.password, passwordRules)
  ) {
    return true
  } else if (checkEmptyField(formDataChangeEmail.password) || checkEmptyField(formDataChangeEmail.email)) {
    return true
  }
  return false
})

const isDisabledButtonChangePhoneNumber = computed(() => {
  if (
    isInValidField(formDataChangePhoneNumber.phoneNumber, phoneNumberRules) ||
    isInValidField(formDataChangePhoneNumber.password, passwordRules)
  ) {
    return true
  } else if (
    checkEmptyField(formDataChangePhoneNumber.phoneNumber) ||
    checkEmptyField(formDataChangePhoneNumber.password)
  ) {
    return true
  }
  return false
})

const isDisabledButtonChangePhoneOTP = computed(() => {
  if (isInValidField(formDataChangePhoneOTP.otpCode, phoneOtpRules)) {
    return true
  } else if (checkEmptyField(formDataChangePhoneOTP.otpCode)) {
    return true
  }
  return false
})

const getDateFormated = (date: Date) => {
  const year = date?.getFullYear()
  const month = String(date?.getMonth() + 1).padStart(2, '0')
  const day = String(date?.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const submit = async () => {
  if (validate()) {
    const dob: any = formData?.dob
    const date = getDateFormated(new Date(dob))
    const userDetailData: UserDetailsUpdate = {
      fullName: formData.fullName,
      gender: formData.gender,
      birthDate: date,
    }
    console.log(userDetailData)
    await userProfileStore
      .updateProfile(userDetailData)
      .then(() => {
        notify({
          title: 'Success',
          message: 'Updated profile successfully!',
          color: 'success',
        })
        getUserDetail()
      })
      .catch((error) => {
        const message = getErrorMessage(error)
        notify({
          title: 'Error',
          message: message,
          color: 'danger',
        })
      })
  }
}

const submitChangePassword = async () => {
  if (validateChangePassword()) {
    const passwordDetailData: PasswordDetailFormData = {
      password: formDataChangePassword.password,
      confirmNewPassword: formDataChangePassword.confirmNewPassword,
      newPassword: formDataChangePassword.newPassword,
    }

    await userProfileStore
      .changePassword(passwordDetailData)
      .then(() => {
        notify({
          title: 'Success',
          message: 'Change password successfully!',
          color: 'success',
        })
      })
      .catch((error) => {
        const message = getErrorMessage(error)
        notify({
          title: 'Error',
          message: message,
          color: 'danger',
        })
      })
      .finally(() => {
        resetChangePassword()
      })
  }
}

const submitChangeEmail = async () => {
  const changeEmailData: ChangeEmailFormData = {
    password: formDataChangeEmail.password,
    email: formDataChangeEmail.email,
  }

  await userProfileStore
    .changeEmail(changeEmailData)
    .then(() => {
      notify({
        title: 'Success',
        message: 'Change email successfully. Please check your email and confirm the email!',
        color: 'success',
      })
      getUserDetail()
    })
    .catch((error) => {
      const message = getErrorMessage(error)
      notify({
        title: 'Error',
        message: message,
        color: 'danger',
      })
    })
    .finally(() => {
      resetChangeEmail()
      isShowModal.value.email = false
    })
}

let interval: any = null

const startTimer = () => {
  interval = setInterval(() => {
    if (OTPTime.value > 0) {
      OTPTime.value -= 1
    } else {
      clearInterval(interval)
    }
  }, 1000)
}

watch(OTPTime, (newVal) => {
  if (newVal === 0 && interval) {
    clearInterval(interval)
  }
})

const submitChangePhone = async () => {
  const changePhoneData: ChangePhoneNumberFormData = {
    phoneNumber: formDataChangePhoneNumber.phoneNumber,
    password: formDataChangePhoneNumber.password,
  }

  await userProfileStore
    .changePhone(changePhoneData)
    .then(() => {
      notify({
        title: 'Success',
        message: 'The OTP code was sent to your phone, fill it in the field to confirm.',
        color: 'success',
      })
      isShowChangePhoneOTP.value = true
      OTPTime.value = OTP.TimeOut
      if (interval) {
        clearInterval(interval)
      }
      startTimer()
      getUserDetail()
    })
    .catch((error) => {
      const message = getErrorMessage(error)
      notify({
        title: 'Error',
        message: message,
        color: 'danger',
      })
    })
}

const validateAvatar = (file: any) => {
  if (file.size > 5 * 1024 * 1024) return false
  return true
}

const handleFileAdded = (files: any) => {
  if (files[0]) {
    fileUploaded.value = files[0]
    if (!validateAvatar(files[0])) {
      notify({
        message: 'Your file is bigger than 5MB. Please upload a file less than 5MB.',
        color: '#e2eafa',
      })
    } else {
      const formDataAvatar = new FormData()
      formDataAvatar.append('Image', files[0])
      uploadAvatar(formDataAvatar)
    }
  }
}

const uploadAvatar = async (formDataAvatar: FormData) => {
  await userProfileStore
    .uploadAvatar(formDataAvatar)
    .then(() => {
      notify({
        title: 'Success',
        message: 'Change avatar successfully!',
        color: 'success',
      })
      getUserDetail()
    })
    .catch((error) => {
      const message = getErrorMessage(error)
      notify({
        title: 'Error',
        message: message,
        color: 'danger',
      })
    })
}

const getSrcAvatar = () => {
  const url = import.meta.env.VITE_APP_BASE_URL as string
  const url_without_api = url.slice(0, -3)
  if (formData?.imageUrl) return `${url_without_api}${formData?.imageUrl}`
  return ''
}

const handleRemoveAvatar = async () => {
  const formDataRemoveAvatar = new FormData()
  formDataRemoveAvatar.append('DeleteCurrentImage', 'true')
  await userProfileStore
    .removeAvatar(formDataRemoveAvatar)
    .then(() => {
      notify({
        title: 'success',
        message: 'Remove avatar successfully!',
        color: 'success',
      })
      getUserDetail()
      authStores.updateAvatarUrl(undefined)
    })
    .catch((error) => {
      const message = getErrorMessage(error)
      notify({
        title: 'Error',
        message: message,
        color: 'danger',
      })
    })
}

const handleCancelChangePhone = () => {
  isShowModal.value.phoneNumber = false
  isShowChangePhoneOTP.value = false
  if (interval) {
    clearInterval(interval)
  }
  resetChangePhone()
  resetChangePhoneOTP()
}

const submitChangePhoneOTP = async () => {
  await userProfileStore
    .getOTPConfirmation(formDataChangePhoneOTP?.otpCode)
    .then(() => {
      notify({
        title: 'Success',
        message: 'Phone confirmed successfully',
        color: 'success',
      })
      getUserDetail()
    })
    .catch((error) => {
      const message = getErrorMessage(error)
      notify({
        title: 'Error',
        message: message,
        color: 'danger',
      })
    })
    .finally(() => {
      resetChangePhoneOTP()
      handleCancelChangePhone()
      resetChangePhone()
    })
}

const verifyPhoneNumber = async () => {
  await userProfileStore
    .sendPhoneOTPCode()
    .then(() => {
      notify({
        title: 'Success',
        message: 'OTP code was sent to your phone, fill it to verify.',
        color: 'success',
      })
      isShowModal.value.phoneNumber = true
      isShowChangePhoneOTP.value = true
      OTPTime.value = OTP.TimeOut
      if (interval) {
        clearInterval(interval)
      }
      startTimer()
    })
    .catch((error) => {
      const message = getErrorMessage(error)
      notify({
        title: 'Error',
        message: message,
        color: 'danger',
      })
    })
}

const verifyEmail = async () => {
  await userProfileStore
    .sendVerifyEmail()
    .then(() => {
      notify({
        title: 'Success',
        message: 'Check your email to verify.',
        color: 'success',
      })
    })
    .catch((error) => {
      const message = getErrorMessage(error)
      notify({
        title: 'Error',
        message: message,
        color: 'danger',
      })
    })
}
</script>

<template>
  <VaInnerLoading :loading="userProfileStore?.isLoading" class="z-50">
    <VaCard v-if="isShowProfile" class="p-2 ml-1 rounded">
      <div class="mt-3 mb-10 flex items-center gap-5">
        <div>
          <VaBadge v-if="formData?.imageUrl" color="danger" overlap placement="top-right" :offset="[-7, 7]">
            <template #text>
              <span class="cursor-pointer" @click="isShowModal.removeAvatar = !isShowModal.removeAvatar">X</span>
            </template>
            <VaModal
              v-model="isShowModal.removeAvatar"
              :ok-text="'Remove'"
              size="small"
              :child-ok-button="{ size: 'small' }"
              :child-cancel-button="{ size: 'small' }"
              @ok="handleRemoveAvatar"
            >
              <p class="text-lg">Are you sure want to remove avatar?</p>
            </VaModal>
            <VaAvatar :src="getSrcAvatar()" size="large" />
          </VaBadge>
          <VaAvatar v-if="!formData?.imageUrl" color="warning" size="large" class="font-bold">{{
            shortNameLetter
          }}</VaAvatar>
        </div>
        <div class="relative">
          <VaFileUpload
            class="opacity-0 absolute top-0 left-0 w-full h-full z-10 inset-0"
            type="single"
            :file-types="typesImage"
            @fileAdded="handleFileAdded"
          />
          <VaButton class="flex items-center" preset="secondary" border-color="primary" size="small">
            <VaIcon name="upload" class="mr-2" />
            Upload
          </VaButton>
        </div>
      </div>
      <VaForm ref="form" @submit.prevent="submit">
        <div class="grid md:grid-cols-2 gap-4">
          <VaField>
            <VaInput
              v-model="formData.fullName"
              :label="'FullName'"
              class="mb-6"
              :rules="[(v: any) => !!v || 'Full Name field is required']"
              :placeholder="'Enter your full name'"
            />
          </VaField>

          <VaField>
            <VaDateInput
              v-model="formData.dob"
              :rules="[(v: any) => !!v || 'Date of birth field is required']"
              class="mb-3"
              :label="'Birth Date'"
              :placeholder="'Enter your birth date'"
            />
          </VaField>
          <VaField>
            <label class="block uppercase text-primary font-bold" style="font-size: 0.57rem">Gender</label>
            <VaRadio
              v-model="formData.gender"
              :rules="[(v: null | undefined) => (v !== null && v !== undefined) || 'Gender field is required']"
              class="mb-3"
              value-by="value"
              name="gender"
              :label="'Choose your gender'"
              :options="genderOptions"
            />
          </VaField>
          <VaField>
            <VaInput
              v-model="formData.phoneNumber"
              :placeholder="'Enter phone number'"
              class="mb-3"
              readonly
              preset="solid"
              :label="'Phone Number'"
            >
              <template #messages>
                <div class="flex justify-between">
                  <p
                    v-if="!userProfileStore?.userDetails?.phoneNumberConfirmed"
                    class="font-semibold text-xs text-orange-500 cursor-pointer mt-1"
                    @click="verifyPhoneNumber"
                  >
                    Verify phone number
                  </p>
                  <p
                    class="font-semibold text-xs text-primary cursor-pointer mt-1"
                    @click="isShowModal.phoneNumber = !isShowModal.phoneNumber"
                  >
                  Change phone number
                  </p>
                </div>
              </template>
            </VaInput>
          </VaField>

          <VaField>
            <VaInput
              v-model="formData.email"
              :placeholder="'Enter your email'"
              readonly
              preset="solid"
              class="mb-3"
              :label="'Email'"
              type="email"
            >
              <template #messages>
                <div class="flex justify-between">
                  <p
                    v-if="!userProfileStore?.userDetails?.emailConfirmed"
                    class="font-semibold text-xs text-orange-500 cursor-pointer mt-1"
                    @click="verifyEmail"
                  >
                    Verify email
                  </p>
                  <p
                    class="font-semibold text-xs text-primary cursor-pointer mt-1"
                    @click="isShowModal.email = !isShowModal.email"
                  >
                  Change email
                  </p>
                </div>
              </template>
            </VaInput>
          </VaField>
        </div>
        <div class="flex justify-end">
          <VaButton class="w-fit rounded mb-3" :disabled="isDisabledButtonUpdateProfile" @click="submit">
            Update
          </VaButton>
        </div>
      </VaForm>
    </VaCard>
    <VaCard v-if="!isShowProfile" class="p-2 ml-1 rounded">
      <VaForm ref="formChangePassword" class="mt-4" @submit.prevent="submitChangePassword">
        <div class="grid md:grid-cols-3 gap-4">
          <VaField>
            <VaValue v-slot="isPasswordVisible" :default-value="false">
              <VaInput
                v-model="formDataChangePassword.password"
                :rules="passwordRules"
                :type="isPasswordVisible.value ? 'text' : 'password'"
                class="mb-4"
                :label="'Current Password'"
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
          </VaField>

          <VaField>
            <VaValue v-slot="isPasswordVisible" :default-value="false">
              <VaInput
                ref="password1"
                v-model="formDataChangePassword.newPassword"
                :rules="passwordRules"
                :type="isPasswordVisible.value ? 'text' : 'password'"
                class="mb-4"
                :label="'New Password'"
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
          </VaField>
          <VaField>
            <VaValue v-slot="isPasswordVisible" :default-value="false">
              <VaInput
                ref="password2"
                v-model="formDataChangePassword.confirmNewPassword"
                :rules="[
                  (v: any) => !!v || 'Confirm Password field is required',
                  (v: string) => v === formDataChangePassword.newPassword || 'Passwords do not match',
                ]"
                :type="isPasswordVisible.value ? 'text' : 'password'"
                class="mb-4"
                :label="'Confirm New Password'"
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
          </VaField>
        </div>
        <div class="flex justify-end">
          <VaButton class="w-fit rounded mb-3" :disabled="isDisabledButtonChangePassword" @click="submitChangePassword">
            Update
          </VaButton>
        </div>
      </VaForm>
    </VaCard>

    <VaModal v-model="isShowModal.email" hide-default-actions size="small">
      <h3 class="va-h3 text-center">Email</h3>
      <VaForm ref="formChangeEmail" @submit.prevent="submitChangeEmail">
        <VaField>
          <VaInput
            v-model="formDataChangeEmail.email"
            :placeholder="'Enter new email'"
            :rules="emailRules"
            class="mb-3"
            :label="'Email'"
            type="email"
          />
        </VaField>
        <VaField>
          <VaValue v-slot="isPasswordVisible" :default-value="false">
            <VaInput
              v-model="formDataChangeEmail.password"
              :rules="passwordRules"
              :type="isPasswordVisible.value ? 'text' : 'password'"
              class="mb-4"
              :placeholder="'Enter password'"
              :label="'Password'"
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
        </VaField>
        <VaButton class="w-full rounded mb-3" :disabled="isDisabledButtonChangeEmail" @click="submitChangeEmail">
          Confirm
        </VaButton>
        <p class="text-primary text-sm text-start cursor-pointer" @click="isShowModal.email = false">&#60; Back</p>
      </VaForm>
    </VaModal>
    <VaModal v-model="isShowModal.phoneNumber" hide-default-actions size="small">
      <h3 class="va-h3 text-center">
        {{ isShowChangePhoneOTP ? 'OTP Confirmation' : 'Change phone number' }}
      </h3>
      <VaForm v-if="!isShowChangePhoneOTP" ref="formChangePhone" @submit.prevent="submitChangePhone">
        <VaField>
          <VaInput
            v-model="formDataChangePhoneNumber.phoneNumber"
            :placeholder="'Enter new phone number'"
            :rules="phoneNumberRules"
            class="mb-3"
            :label="'New phone number'"
          />
        </VaField>
        <VaField>
          <VaValue v-slot="isPasswordVisible" :default-value="false">
            <VaInput
              v-model="formDataChangePhoneNumber.password"
              :rules="passwordRules"
              :type="isPasswordVisible.value ? 'text' : 'password'"
              class="mb-4"
              :placeholder="'Enter password'"
              :label="'Password'"
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
        </VaField>
        <VaButton class="w-full rounded mb-3" :disabled="isDisabledButtonChangePhoneNumber" @click="submitChangePhone">
          Confirm
        </VaButton>
        <p class="text-primary text-sm text-start cursor-pointer" @click="handleCancelChangePhone">&#60; Back</p>
      </VaForm>
      <VaForm v-if="isShowChangePhoneOTP" ref="formChangePhoneOTP" @submit.prevent="submitChangePhoneOTP">
        <VaField>
          <VaInput
            v-model="formDataChangePhoneOTP.otpCode"
            :placeholder="'Enter OTP code'"
            :rules="phoneOtpRules"
            class="mb-3"
            :label="'OTP Code'"
          />
        </VaField>

        <p class="text-primary text-sm text-start">
          <span v-if="OTPTime !== 0" class="mr-2">Remaining {{ OTPTime }}s</span>
          <span v-if="OTPTime === 0" class="cursor-pointer" @click="verifyPhoneNumber">&#11118; Resend</span>
        </p>
        <VaButton class="w-full rounded mb-3" :disabled="isDisabledButtonChangePhoneOTP" @click="submitChangePhoneOTP">
          Confirm
        </VaButton>
        <p class="text-primary text-sm text-start cursor-pointer" @click="handleCancelChangePhone">&#60; Back</p>
      </VaForm>
    </VaModal>
  </VaInnerLoading>
</template>
