<script lang="ts" setup>
import { clinicProfileStore } from '@modules/clinic.module'
import { useDentistStore } from '@modules/dentist.module'
import { Clinic, DentalFilterResponse } from '@/pages/dental/types'
import { useToast } from 'vuestic-ui'
import { Dentist } from '../../../dentist/types'
import { ref, onMounted, Ref } from 'vue'
import { useUserProfileStore } from '@/stores/modules/user.module'
import { AppointmentType } from '@/pages/appointment/types'
import { AppointmentRequest } from '@/pages/appointment/types'
import { useAppointmentStore } from '@/stores/modules/appointment.module'
import { PaginationType } from '@/pages/audit-logs/types'
import { useAuthStore } from '@/stores/modules/auth.module'

const clinicStore = clinicProfileStore()
const dentistStore = useDentistStore()
const { init } = useToast()
const clinicItem: Ref<any[]> = ref([])
const clinicsPagination: Ref<Clinic[]> = ref([])
const clinicFilter: Ref<DentalFilterResponse | null> = ref(null)
const userProfileStore = useUserProfileStore()
const authStore = useAuthStore()
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

const getAllClinic = async () => {
  try {
    await clinicStore.getAllClinics()
    clinicItem.value = clinicStore.clinics.map((clinic) => ({
      ...clinic,
      createdAt: new Date(clinic.createdAt),
      updatedAt: new Date(clinic.updatedAt),
    }))
    await fetchUserNames()
    pagination.value.totalCount = clinicItem.value.length
    pagination.value.totalPages = Math.ceil(clinicItem.value.length / pagination.value.pageSize)
    clinicsPagination.value = clinicItem.value.slice(
      (pagination.value.currentPage - 1) * pagination.value.pageSize,
      pagination.value.currentPage * pagination.value.pageSize,
    )
  } catch (error) {
    console.error('Error fetching dental records:', error)
    clinicFilter.value = null
  }
}

const fetchUserNames = async () => {
  for (const item of clinicItem.value) {
    if (item.ownerID && !userNames.value[item.ownerID]) {
      try {
        await userProfileStore.getUserById(item.ownerID)
        userNames.value[item.ownerID] = userProfileStore?.userDetails?.fullName || 'Unknown'
      } catch (error) {
        console.error('Error fetching user details:', error)
        userNames.value[item.ownerID] = 'Unknown'
      }
    }
  }
}

const handlePageChange = (newPage: number) => {
  const newCurrentPage = Math.ceil(newPage / pagination.value.pageSize)
  pagination.value.currentPage = newCurrentPage

  getAllClinic()
}

const showModal = ref(false)

const listDentistDetails = ref<Dentist[]>([])

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
    listDentistDetails.value = dentistStore.dentists
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

const dentistDetailSelected = ref<Dentist | null>(null)

const handleBookAppointment = (dentist: Dentist) => {
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
  getAllClinic()
})
</script>
<template>
  <section>
    <div class="container-fluid px-4 px-lg-5 mt-5">
      <div class="row g-4 clinic-grid">
        <div v-for="clinic in clinicsPagination" :key="clinic.ownerID" class="col-12 col-sm-6 col-md-4 col-lg-3">
          <div class="card h-100">
            <div class="card-img-container">
              <img
                class="card-img-top"
                :src="'https://cdn.iconscout.com/icon/premium/png-256-thumb/clinic-2054876-1730482.png'"
                alt="Clinic Image"
              />
            </div>
            <div class="card-body d-flex flex-column">
              <h5 class="card-title fw-bold">Name: {{ clinic.name }}</h5>
              <p class="card-text">
                <small>
                  <i class="fas fa-map-marker-alt">Address: </i> {{ clinic.address || 'No address provided' }}
                </small>
              </p>
              <p class="card-text">
                <small> <i class="fas fa-user"></i> Owner: {{ userNames[clinic.ownerID] || 'Unknown' }} </small>
              </p>
            </div>
            <div class="card-footer text-center bg-transparent border-top-0">
              <VaButton class="w-100 btn-booking" @click="handleEditClinic(clinic)">Booking</VaButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
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
  <VaModal v-model="showModal" hide-default-actions size="large">
    <h3 class="va-h3">{{ showClinic?.name }}</h3>

    <p class="va-text">{{ showClinic?.address }}</p>

    <VaDataTable :items="listDentistDetails" :columns="columns">
      <template #cell(actions)="{ rowData }">
        <VaButton size="small" @click="handleBookAppointment(rowData as Dentist)">Book</VaButton>
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
<style scoped>
.clinic-grid {
  display: flex;
  flex-wrap: wrap;
}
.card-img-container {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.card-body {
  flex-grow: 1;
}

.btn-booking {
  background-color: #007bff;
  color: white;
  transition: all 0.3s ease;
}

.btn-booking:hover {
  background-color: #0056b3;
}

@media (max-width: 575.98px) {
  .col-12 {
    flex: 0 0 100%;
    max-width: 100%;
  }
}
</style>
