<script lang="ts" setup>
import { computed, ref, onMounted, Ref } from 'vue'
import { useAuthStore } from '@modules/auth.module'
import Admin from './widgets/Admin.vue'
import { clinicProfileStore } from '@modules/clinic.module'
import { useDentistStore } from '@modules/dentist.module'
import { Clinic, DentalFilterResponse } from '@/pages/dental/types'
import { useToast } from 'vuestic-ui'
import { DentistDetails } from '../../dentist/types'
import { useUserProfileStore } from '@/stores/modules/user.module'
import { AppointmentType } from '@/pages/appointment/types'
import { AppointmentRequest } from '@/pages/appointment/types'
import { useAppointmentStore } from '@/stores/modules/appointment.module'
import { PaginationType } from '@/pages/audit-logs/types'

const authStore = useAuthStore()
const isAdmin = computed(() => authStore?.musHaveRole('SuperAdmin'))
const isCustomer = computed(() => authStore?.musHaveRole('Customer'))

const dentalStore = clinicProfileStore()
const dentistStore = useDentistStore()
const { init } = useToast()
const dentalRecords: Ref<any[]> = ref([])
const dentalRecordsPagination: Ref<Clinic[]> = ref([])
const dentalRecordsFilter: Ref<DentalFilterResponse | null> = ref(null)
const userProfileStore = useUserProfileStore()

const page = ref(1)
const userNames: Ref<{ [key: string]: string }> = ref({})

const pagination = ref<PaginationType>({
  currentPage: 1,
  totalPages: 1,
  totalCount: 1,
  pageSize: 10,
  hasPreviousPage: false,
  hasNextPage: false,
})

const getAllDental = async () => {
  try {
    await dentalStore.getAllClinics()
    dentalRecords.value = dentalStore.clinics.map((clinic) => ({
      ...clinic,
      createdAt: new Date(clinic.createdAt),
      updatedAt: new Date(clinic.updatedAt),
    }))
    await fetchUserNames()
    pagination.value.totalCount = dentalRecords.value.length
    pagination.value.totalPages = Math.ceil(dentalRecords.value.length / pagination.value.pageSize)
    dentalRecordsPagination.value = dentalRecords.value.slice(
      (pagination.value.currentPage - 1) * pagination.value.pageSize,
      pagination.value.currentPage * pagination.value.pageSize,
    )
  } catch (error) {
    console.error('Error fetching dental records:', error)
    dentalRecordsFilter.value = null
  }
}

const fetchUserNames = async () => {
  for (const clinic of dentalRecords.value) {
    if (clinic.ownerID && !userNames.value[clinic.ownerID]) {
      try {
        await userProfileStore.getUserById(clinic.ownerID)
        userNames.value[clinic.ownerID] = userProfileStore?.userDetails?.fullName || 'Unknown'
      } catch (error) {
        console.error('Error fetching user details:', error)
        userNames.value[clinic.ownerID] = 'Unknown'
      }
    }
  }
}

const handlePageChange = (newPage: number) => {
  const newCurrentPage = Math.ceil(newPage / pagination.value.pageSize)
  pagination.value.currentPage = newCurrentPage

  getAllDental()
}

const showModal = ref(false)

const listDentistDetails = ref<DentistDetails[]>([])

const showClinic = ref<Clinic | null>(null)

const handleEditClinic = async (clinic: Clinic) => {
  console.log('clinic', clinic)
  showModal.value = true
  showClinic.value = clinic
  await getAllDentistDetailsOfClinic(clinic.id)
}
const getAllDentistDetailsOfClinic = async (clinicID: string) => {
  try {
    await dentistStore.getAllDentistDetailsOfClinic(clinicID)
    listDentistDetails.value = dentistStore.dentistDetails
    console.log('listDentistDetails', listDentistDetails.value)

    for (const dentist of listDentistDetails.value) {
      console.log('dentist', dentist)
      try {
        await userProfileStore.getUserById(dentist.dentistId)
        dentist.dentistName = userProfileStore?.userDetails?.fullName || 'Unknown'
      } catch (error) {
        console.error('Error fetching dentist details:', error)
        dentist.dentistName = 'Unknown'
      }
    }

    console.log('listDentistDetails', listDentistDetails.value)
  } catch (error) {
    console.error('Error fetching dentist details:', error)
    listDentistDetails.value = []
  }
}

const columns = [
  { key: 'dentistName' },
  { key: 'degree' },
  { key: 'institute' },
  { key: 'specialization' },
  { key: 'yearOfExperience' },
  { key: 'actions' },
]
const showModalBook = ref(false)

const dentistDetailSelected = ref<DentistDetails | null>(null)

const handleBookAppointment = (dentist: DentistDetails) => {
  console.log('dentist', dentist)
  showModalBook.value = true
  dentistDetailSelected.value = dentist
}

const bookingForm = ref({
  patientID: '',
  dentistID: '',
  clinicID: '',
  timeSlot: new Date(),
  type: AppointmentType.Examination,
  date: new Date(2000, 0, 1),
  duration: 0,
})

// {
//   "patientID": "95dbb96b-0a95-4ff1-33d5-08dcaa76f7aa",
//   "dentistID": "95dbb96b-0a95-4ff1-33d5-08dcaa76f7aa",
//   "clinicID": "af19febd-ee76-479a-9dfa-40633c685524",
//   "timeSlot": "11:30:00",
//   "type": 0,
//   "date": "2024-07-22T21:36:39.979Z",
//   "duration": 10
// }
const bookingFormReq = ref<AppointmentRequest>({
  patientID: '',
  dentistID: '',
  clinicID: '',
  timeSlot: '',
  type: AppointmentType.Examination,
  date: '',
  duration: 0,
})

const appointmentStore = useAppointmentStore()

const booking = ref(false)

const handleBookAppointmentSubmit = async () => {
  bookingForm.value.patientID = authStore?.user?.id || ''
  bookingForm.value.dentistID = dentistDetailSelected.value?.dentistId || ''
  bookingForm.value.clinicID = showClinic.value?.id || ''
  console.log('Booking details:', bookingForm.value)

  // bookingForm tp bookingFormReq
  bookingFormReq.value.patientID = bookingForm.value.patientID
  bookingFormReq.value.dentistID = bookingForm.value.dentistID
  bookingFormReq.value.clinicID = bookingForm.value.clinicID
  bookingFormReq.value.timeSlot = bookingForm.value.timeSlot.toTimeString().slice(0, 8)
  bookingFormReq.value.type = bookingForm.value.type
  bookingFormReq.value.date = bookingForm.value.date.toISOString()
  bookingFormReq.value.duration = bookingForm.value.duration

  booking.value = true
  await appointmentStore
    .createAppointment(bookingFormReq.value)
    .then(() => {
      init({
        title: 'Success',
        message: 'Appointment booked successfully',
        color: 'success',
      })
    })
    .catch(() => {
      init({
        title: 'Error',
        message: 'Error booking appointment',
        color: 'danger',
      })
    })
    .finally(() => {
      booking.value = false
    })

  console.log('Booking details:', bookingFormReq.value)

  // Add your booking logic here
  showModalBook.value = false
  showModal.value = false
}

const options = [
  {
    text: 'Examination',
    textBy: 'Examination',
    value: AppointmentType.Examination,
    valueBy: AppointmentType.Examination,
  },
  {
    text: 'Treatment',
    textBy: 'Treatment',
    value: AppointmentType.Treatment,
    valueBy: AppointmentType.Treatment,
  },
  {
    text: 'Reexamination',
    textBy: 'Reexamination',
    value: AppointmentType.Reexamination,
    valueBy: AppointmentType.Reexamination,
  },
  {
    text: 'Periodic',
    textBy: 'Periodic',
    value: AppointmentType.Periodic,
    valueBy: AppointmentType.Periodic,
  },
]

onMounted(() => {
  getAllDental()
})
</script>

<template>
  <div class="md:mx-28">
    <Admin v-if="isAdmin" />
    <div v-if="isCustomer">
      <div class="min-h-[80vh]">
        <div class="flex flex-wrap">
          <div v-for="clinic in dentalRecordsPagination" :key="clinic.ownerID" class="w-full md:w-1/4 px-4 mb-4">
            <VaCard class="bg-white rounded-lg shadow-md p-6 flex">
              <div class="flex flex-col" style="width: 100%">
                <div class="flex">
                  <div class="flex-1 min-h-[250px]">
                    <h3 class="text-lg font-semibold">{{ clinic.name }}</h3>
                    <p class="text-gray-600">{{ clinic.address || 'No address provided' }}</p>
                    <p class="text-gray-600">Owner: {{ userNames[clinic.ownerID] || 'Unknown' }}</p>
                    <p class="text-gray-600">Verified: {{ clinic.verified ? 'Yes' : 'No' }}</p>
                    <p class="text-gray-600">Created At: {{ new Date(clinic.createdAt).toLocaleDateString() }}</p>
                    <p class="text-gray-600">Updated At: {{ new Date(clinic.updatedAt).toLocaleDateString() }}</p>
                    <div>
                      <h4 class="font-medium mt-2">Details:</h4>
                      <ul>
                        <li v-for="detail in clinic.clinicDetails" :key="detail.clinicID">
                          <p>{{ detail.dayOfTheWeek }}: {{ detail.openingTime }} - {{ detail.closingTime }}</p>
                          <p>Slot Duration: {{ detail.slotDuration }} minutes</p>
                          <p>Max Patients per Slot: {{ detail.maxPatientsPerSlot }}</p>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div class="ml-4">
                    <img
                      :src="'https://cdn.iconscout.com/icon/premium/png-256-thumb/clinic-2054876-1730482.png'"
                      alt="Owner Image"
                      class="w-24 h-24 rounded-full object-cover"
                    />
                  </div>
                </div>
                <div>
                  <VaCardActions align="center">
                    <VaButton @click="handleEditClinic(clinic)">Booking</VaButton>
                  </VaCardActions>
                </div>
              </div>
            </VaCard>
          </div>
        </div>
      </div>
      <div v-if="pagination.totalPages > 1" class="mt-4">
        <VaCard class="p-5">
          <VaPagination
            v-model="page"
            :total="pagination.totalCount"
            :page-size="pagination.pageSize"
            :visible-pages="6"
            buttons-preset="secondary"
            border-color="primary"
            gapped
            rounded
            class="justify-center sm:justify-center"
            @update:modelValue="handlePageChange"
          />
        </VaCard>
      </div>
    </div>
  </div>

  <VaModal v-model="showModal" hide-default-actions size="large">
    <h3 class="va-h3">{{ showClinic?.name }}</h3>

    <p class="va-text">{{ showClinic?.address }}</p>

    <VaDataTable :items="listDentistDetails" :columns="columns">
      <template #cell(actions)="{ rowData }">
        <VaButton size="small" @click="handleBookAppointment(rowData as DentistDetails)">Book</VaButton>
      </template>
      <template #footer>
        <div class="flex mt-5">
          <div class="flex-4">
            <VaButton preset="secondary" @click="showModal = false">Close</VaButton>
          </div>
        </div>
      </template>
    </VaDataTable>
  </VaModal>

  <VaModal v-model="showModalBook" hide-default-actions size="large">
    <VaInnerLoading :loading="booking">
      <h3>Book Appointment</h3>
      <div class="space-y-4">
        <VaTimeInput v-model="bookingForm.timeSlot" class="w-28" />
        <VaSelect
          v-model="bookingForm.type"
          :options="options"
          label="Appointment Type"
          placeholder="Select appointment type"
          required
        />
        <VaDateInput v-model="bookingForm.date" label="Day" />
        <VaInput
          v-model="bookingForm.duration"
          label="Duration (minutes)"
          type="number"
          placeholder="Enter duration in minutes"
          required
        />
      </div>
    </VaInnerLoading>
    <template #footer>
      <div class="flex mt-5">
        <div class="flex-4">
          <VaButton preset="secondary" @click="showModalBook = false">Close</VaButton>
          <VaButton preset="danger" class="mr-2" @click="handleBookAppointmentSubmit">Book</VaButton>
        </div>
      </div>
    </template>
  </VaModal>
</template>
