<template>
  <VaForm v-slot="{ validate }" class="flex flex-col gap-2">
    <VaSelect
      v-model="newDentist.dentistId"
      value-by="value"
      clearable
      :options="users.map((o) => ({ text: o.fullName, value: o.id }))"
      :label="t('dentists.user')"
      :placeholder="t('dentists.select_user')"
    />
    <VaSelect
      v-model="newDentist.clinicId"
      value-by="value"
      clearable
      :options="clinics.map((o) => ({ text: o.name, value: o.id }))"
      :label="t('clinics.clinic')"
      :placeholder="t('clinics.select_clinic')"
    />

    <VaInput
      v-model="newDentist.degree"
      :label="t('dentists.degree')"
      :placeholder="t('dentists.enter_degree')"
      :rules="[validators.required2(t('dentists.degree')), validators.maxLength(50)]"
    />
    <VaInput
      v-model="newDentist.institute"
      :label="t('dentists.institute')"
      :placeholder="t('dentists.enter_institute')"
      :rules="[validators.required2(t('dentists.institute')), validators.maxLength(50)]"
    />
    <VaInput
      v-model="newDentist.specialization"
      :label="t('dentists.specialization')"
      :placeholder="t('dentists.enter_specialization')"
      :rules="[validators.required2(t('dentists.specialization')), validators.maxLength(50)]"
    />
    <VaCounter
      v-model="newDentist.yearOfExperience"
      manual-input
      :label="t('dentists.yearOfExperience')"
      :placeholder="t('dentists.enter_yearOfExperience')"
    />
    <VaCard class="flex justify-end flex-col-reverse sm:flex-row mt-4 gap-2">
      <VaButton preset="secondary" color="secondary" @click="$emit('close')">{{ t('settings.cancel') }}</VaButton>
      <VaButton @click="validate() && $emit('save', newDentist as Dentist)">{{ saveButtonLabel }}</VaButton>
    </VaCard>
  </VaForm>
</template>

<script setup lang="ts">
import { getErrorMessage, notifications, validators } from '@/services/utils'
import { Dentist, EmptyDentist } from '../types'
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/modules/user.module'
import { clinicProfileStore } from '@/stores/modules/clinic.module'
import { useToast } from 'vuestic-ui/web-components'
import { UserDetail } from '@/pages/user/types'
import { Clinic } from '@/pages/home/clinic/types'

const { t } = useI18n()

const props = defineProps<{
  dentist: Dentist | null
  saveButtonLabel: string
}>()

const defaultNewDentist: Dentist = {
  dentistId: '',
  clinicId: '',
  degree: '',
  institute: '',
  specialization: '',
  yearOfExperience: 0,
}

const newDentist = ref({ ...defaultNewDentist })

const isFormHasUnsavedChanges = computed(() => {
  return Object.keys(newDentist.value).some((key) => {
    return (
      newDentist.value[key as keyof EmptyDentist] !== (props.dentist ?? defaultNewDentist)?.[key as keyof EmptyDentist]
    )
  })
})

defineExpose({
  isFormHasUnsavedChanges,
})

watch(
  () => props.dentist,
  () => {
    if (!props.dentist) {
      return
    }
    newDentist.value = { ...props.dentist }
  },
  { immediate: true },
)
const { init: notify } = useToast()

const clinics = ref<Clinic[]>([])
const users = ref<UserDetail[]>([])
const clinicStores = clinicProfileStore()
const userStores = useUserStore()

const getClinics = async () => {
  await clinicStores.getAllClinics()
  clinics.value = clinicStores.clinics
  // console.log('clinics', clinics.value)
}

const dataFilter = ref({
  pageNumber: 0,
  pageSize: 100,
})

const getUsers = async () => {
  userStores
    .getUsers(dataFilter.value)
    .then((response) => {
      users.value = response.data
      // console.log('users', users.value)
      // console.log('response', response)
    })
    .catch((error) => {
      notify({
        message: notifications.getFailed(t('users.user')) + getErrorMessage(error),
        color: 'error',
      })
    })
}

onMounted(() => {
  getClinics()
  getUsers()
})
</script>
