<script lang="ts" setup>
import { useDentalStore } from '@/stores/modules/dental.module'
import { ref, reactive, watch, computed, onMounted } from 'vue'
import { CreateDentalRequest, SettingShowDetail, GetAppointmentForCreateDental } from '../types'
import { useRouter } from 'vue-router'

const router = useRouter()
const dentalStore = useDentalStore()
const appointment = ref<GetAppointmentForCreateDental>()
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
const getAppointmentForCreateDental = async (id: string) => {
  try {
    const res = await dentalStore.GetAppointmentForCreateDental(id)
    appointment.value = res
  } catch (error) {
    console.error('Error fetching dental record:', error)
  }
}
// Đặt dữ liệu mẫu để gửi đi
const formData = reactive<CreateDentalRequest>({
  appointmentID: '',
  prescriptionRequests: [
    {
      medicineName: '',
      dosage: '',
      instructions: '',
    },
  ],
  medicalRecordRequest: {
    symptoms: '',
    diagnosis: '',
    treatment: '',
  },
  followUpAppointmentRequest: {
    scheduledDate: new Date().toISOString(),
    reason: '',
  },
})
const isScheduledDateValid = computed(() => {
  const scheduledDate = new Date(formData.followUpAppointmentRequest.scheduledDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return scheduledDate > today
})
const isFormValid = computed(() => {
  return (
    formData.appointmentID &&
    formData.prescriptionRequests.every((p) => p.medicineName && p.dosage && p.instructions) &&
    formData.medicalRecordRequest.symptoms &&
    formData.medicalRecordRequest.diagnosis &&
    formData.medicalRecordRequest.treatment &&
    formData.followUpAppointmentRequest.scheduledDate &&
    formData.followUpAppointmentRequest.reason &&
    isScheduledDateValid.value
  )
})
const submitForm = async () => {
  dentalStore.isLoading = true
  try {
    await dentalStore.CreateDental(formData).then(() => {
      router.push({ name: 'record-list' })
    })
  } catch (error) {
    console.error('Failed to create dental record:', error)
  } finally {
    dentalStore.isLoading = false
  }
}
const addPrescription = () => {
  formData.prescriptionRequests.push({
    medicineName: '',
    dosage: '',
    instructions: '',
  })
}
const removePrescription = (index: number) => {
  formData.prescriptionRequests.splice(index, 1)
}
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
  const id = '2dde2656-1fa2-4f35-0396-08dcabe81658'
  getAppointmentForCreateDental(id)
  formData.appointmentID = id
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
const getAppointmentStatus = (type: number) => {
  const types = ['Scheduled', 'Completed', 'Cancelled', 'Pending']
  return types[type] || 'Unknown'
}
</script>

<template>
  <VaInnerLoading :loading="dentalStore?.isLoading" class="z-50">
    <form @submit.prevent="submitForm">
      <!-- Appointment Section -->
      <VaCard v-if="isAppointment" class="p-2 ml-1 rounded">
        <div class="grid md:grid-cols-2 gap-4">
          <VaField>
            <VaInput v-if="appointment" v-model="appointment.dentist" :label="'Dentist'" class="mb-6" readonly />
          </VaField>
          <VaField>
            <VaInput v-if="appointment" v-model="appointment.clinic" class="mb-3" :label="'At'" readonly />
          </VaField>
          <VaField>
            <VaInput v-if="appointment" v-model="appointment.timeSlot" class="mb-3" :label="'Time'" readonly />
          </VaField>
          <VaField>
            <VaInput v-if="appointment" v-model="appointment.patient" class="mb-3" :label="'Patient'" readonly />
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
          <VaField>
            <VaInput
              v-if="appointment"
              :model-value="getAppointmentStatus(appointment.status)"
              class="mb-3"
              :label="'Status'"
              readonly
            />
          </VaField>
        </div>
      </VaCard>

      <!-- Prescriptions Section -->
      <VaCard v-if="isPrescriptions" class="p-2 ml-1 rounded">
        <div class="prescription-container">
          <div v-for="(item, index) in formData.prescriptionRequests" :key="index" class="prescription-item">
            <div class="grid md:grid-cols-2 gap-4">
              <VaField>
                <VaInput v-model="item.medicineName" label="Medicine Name" required />
              </VaField>
              <VaField>
                <VaInput v-model="item.dosage" label="Dosage" required />
              </VaField>
              <VaField>
                <VaInput v-model="item.instructions" label="Instructions" required />
              </VaField>
            </div>
            <div class="flex justify-end mt-2">
              <VaButton
                type="button"
                :disabled="formData.prescriptionRequests.length === 1"
                color="danger"
                @click="removePrescription(index)"
                >Delete</VaButton
              >
            </div>
          </div>
          <div class="button-container">
            <VaButton type="button" color="secondary" @click="addPrescription">Add More Prescription</VaButton>
          </div>
        </div>
      </VaCard>

      <!-- Medical Record Section -->
      <VaCard v-if="isMedicalRecord" class="p-2 ml-1 rounded">
        <div class="grid md:grid-cols-2 gap-4">
          <VaField>
            <VaInput v-model="formData.medicalRecordRequest.symptoms" label="Symptoms" required />
          </VaField>
          <VaField>
            <VaInput v-model="formData.medicalRecordRequest.diagnosis" label="Diagnosis" required />
          </VaField>
          <VaField>
            <VaInput v-model="formData.medicalRecordRequest.treatment" label="Treatment" required />
          </VaField>
        </div>
      </VaCard>

      <!-- Follow-Up Appointments Section -->
      <VaCard v-if="isFollowUpAppointments" class="p-2 ml-1 rounded">
        <div class="grid md:grid-cols-2 gap-4">
          <VaField>
            <VaInput
              v-model="formData.followUpAppointmentRequest.scheduledDate"
              label="Scheduled Date"
              type="datetime-local"
              required
            />
            <div v-if="!isScheduledDateValid" class="text-red-500 text-sm mt-1">Scheduled date is not valid!</div>
          </VaField>
          <VaField>
            <VaInput v-model="formData.followUpAppointmentRequest.reason" label="Reason" required />
          </VaField>
        </div>
      </VaCard>

      <div class="mt-4">
        <VaButton type="submit" color="primary" :disabled="!isFormValid">Submit</VaButton>
      </div>
    </form>
  </VaInnerLoading>
</template>

<style scoped>
.prescription-container {
  display: flex;
  flex-direction: column;
}

.prescription-item {
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  padding: 1rem;
  border-radius: 5px;
}

.button-container {
  align-self: flex-end;
  margin-top: 1rem;
}
</style>
