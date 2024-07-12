<script lang="ts" setup>
import { useDentalStore } from '@/stores/modules/dental.module'
import { onMounted, ref, watch, computed } from 'vue'
import {
  DentalRecord,
  Appointment,
  Prescription,
  MedicalRecord,
  FollowUpAppointment,
  SettingShowDetail,
} from '../types'
const dentalStore = useDentalStore()
const dentalRecords = ref<DentalRecord>()
const appointment = ref<Appointment>()
const prescription = ref<Prescription[]>()
const medical = ref<MedicalRecord>()
const followUp = ref<FollowUpAppointment[]>()
const getDentalByID = async (id: string) => {
  try {
    const res = await dentalStore.GetDentalRecordByID(id)
    dentalRecords.value = res
    console.log('Dental Record:', dentalRecords.value)
    appointment.value = dentalRecords.value?.appointment
    prescription.value = dentalRecords.value?.prescriptions
    medical.value = dentalRecords.value?.medicalRecord
    followUp.value = dentalRecords.value?.followUpAppointments
  } catch (error) {
    console.error('Error fetching dental record:', error)
  }
}
const isAppointment = ref(true)
const isPrescriptions = ref(false)
const isMedicalRecord = ref(false)
const isFollowUpAppointments = ref(false)
const props = defineProps({
  settingOption: {
    type: Object as () => SettingShowDetail | null,
    default: null,
  },
})
watch(
  () => props.settingOption?.id,
  (id) => {
    isAppointment.value = id === '1'
    isPrescriptions.value = id === '2'
    isFollowUpAppointments.value = id === '3'
    isMedicalRecord.value = id === '4'
  },
  { immediate: true },
)
onMounted(() => {
  getDentalByID(dentalStore.id)
  const id = props.settingOption?.id
  isAppointment.value = id === '1'
  isPrescriptions.value = id === '2'
  isFollowUpAppointments.value = id === '3'
  isMedicalRecord.value = id === '4'
})
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}
const formattedDate = computed(() => {
  return appointment.value?.date ? formatDate(appointment.value.date) : ''
})
const getAppointmentType = (type: number) => {
  const types = ['Examination', 'Treatment', 'Reexamination', 'Periodic']
  return types[type] || 'Unknown'
}
const appointmentType = computed(() => {
  return appointment.value?.type !== undefined ? getAppointmentType(appointment.value.type) : 'Unknown'
})
</script>
<template>
  <VaInnerLoading :loading="dentalStore?.isLoading" class="z-50">
    <VaCard v-if="isAppointment" class="p-2 ml-1 rounded">
      <div class="grid md:grid-cols-2 gap-4">
        <VaField>
          <VaInput v-if="appointment" v-model="appointment.dentist.fullName" :label="'Dentist'" class="mb-6" readonly />
        </VaField>
        <VaField>
          <VaInput v-if="appointment" v-model="appointment.clinic.name" class="mb-3" :label="'At'" readonly />
        </VaField>
        <VaField>
          <VaInput v-if="appointment" v-model="appointment.clinic.address" class="mb-3" :label="'Address'" readonly />
        </VaField>
        <VaField>
          <VaInput v-if="appointment" v-model="appointment.timeSlot" class="mb-3" :label="'Time'" readonly />
        </VaField>
        <VaField>
          <VaInput v-if="appointment" v-model="appointment.patient.fullName" class="mb-3" :label="'Patient'" readonly />
        </VaField>
        <VaField>
          <VaInput v-if="appointment" :model-value="formattedDate" class="mb-3" :label="'Date'" readonly />
        </VaField>
        <VaField>
          <VaInput v-if="appointment" :model-value="appointmentType" class="mb-3" :label="'Type'" readonly />
        </VaField>
        <VaField>
          <VaInput v-if="appointment" v-model="appointment.duration" class="mb-3" :label="'Duration'" readonly />
        </VaField>
      </div>
    </VaCard>
    <VaCard v-if="isPrescriptions" class="p-2 ml-1 rounded">
      <div v-for="item in prescription" :key="item.id" class="grid md:grid-cols-2 gap-4">
        <VaField>
          <VaInput v-if="appointment" v-model="appointment.dentist.fullName" class="mb-6" :label="'Dentist'" readonly />
        </VaField>
        <VaField>
          <VaInput :model-value="formatDate(item.createdAt)" :label="'Create Date'" class="mb-6" readonly />
        </VaField>
        <VaField>
          <VaInput v-model="item.medicineName" :label="'Medicine Name'" class="mb-6" readonly />
        </VaField>
        <VaField>
          <VaInput v-model="item.instructions" :label="'Instruction'" class="mb-6" readonly />
        </VaField>
        <VaField>
          <VaInput v-model="item.dosage" :label="'Dosage'" class="mb-6" readonly />
        </VaField>
      </div>
    </VaCard>
    <VaCard v-if="isFollowUpAppointments" class="p-2 ml-1 rounded">
      <div v-for="item in followUp" :key="item.id" class="grid md:grid-cols-2 gap-4">
        <VaField>
          <VaInput :model-value="formatDate(item.createdAt)" :label="'Create At'" class="mb-6" readonly />
        </VaField>
        <VaField>
          <VaInput :model-value="formatDate(item.scheduledDate)" :label="'Date'" class="mb-6" readonly />
        </VaField>
        <VaField>
          <VaInput v-model="item.reason" :label="'Reason'" class="mb-6" readonly />
        </VaField>
        <VaField>
          <VaInput v-model="item.isSuccess" :label="'Done'" class="mb-6" readonly />
        </VaField>
      </div>
    </VaCard>
    <VaCard v-if="isMedicalRecord" class="p-2 ml-1 rounded">
      <div class="grid md:grid-cols-2 gap-4">
        <VaField>
          <VaInput v-if="appointment" v-model="appointment.dentist.fullName" :label="'Dentist'" class="mb-6" readonly />
        </VaField>
        <VaField>
          <VaInput
            v-if="medical"
            :model-value="formatDate(medical.createdAt)"
            :label="'Create Date'"
            class="mb-6"
            readonly
          />
        </VaField>
        <VaField>
          <VaInput v-if="medical" v-model="medical.symptoms" :label="'Symptom'" class="mb-6" readonly />
        </VaField>
        <VaField>
          <VaInput v-if="medical" v-model="medical.diagnosis" :label="'Diagnosis'" class="mb-6" readonly />
        </VaField>
        <VaField>
          <VaInput v-if="medical" v-model="medical.treatment" :label="'Treatment'" class="mb-6" readonly />
        </VaField>
      </div>
    </VaCard>
  </VaInnerLoading>
</template>
