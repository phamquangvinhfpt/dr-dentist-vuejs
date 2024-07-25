<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { useAppointmentStore } from '@stores/modules/appointment.module'
import { Appointment, AppointmentRequest, AppointmentStatus } from './types'
import { useRouter } from 'vue-router'
import { useToast } from 'vuestic-ui'
import { useAuthStore } from '@/stores/modules/auth.module'

const authStore = useAuthStore()
const { init } = useToast()
const appointmentStore = useAppointmentStore()
const appointments = computed<Appointment[]>(() => appointmentStore.appointments)
const router = useRouter()
const fetchAppointments = async () => {
  await appointmentStore.fetchAllAppointments()
}
const showPopup = ref(false)
const selectedAppointment = ref<Appointment | null>(null)

const openPopup = (appointment: Appointment) => {
  selectedAppointment.value = appointment
  showPopup.value = true
}

const closePopup = () => {
  showPopup.value = false
  selectedAppointment.value = null
}

const updateAppointment = async () => {
  if (selectedAppointment.value) {
    const appointmentRequest: AppointmentRequest = {
      patientID: selectedAppointment.value.patient.id, // Sửa lại thành patientID
      dentistID: selectedAppointment.value.dentist.id, // Sửa lại thành dentistID
      clinicID: selectedAppointment.value.clinicID,
      date: selectedAppointment.value.date,
      timeSlot: selectedAppointment.value.timeSlot,
      duration: selectedAppointment.value.duration, // Thêm duration
      type: selectedAppointment.value.type,
      status: selectedAppointment.value.status,
    }
    await appointmentStore.updateAppointment(selectedAppointment.value.id, appointmentRequest)
    fetchAppointments()
    closePopup()
  }
}
const updateAppointmentStatus = async (appointment: Appointment) => {
  try {
    await appointmentStore.ChangeStatusAppointment(appointment.id, Number(appointment.status))
    init({ message: 'Appointment status updated successfully', color: 'success' })
  } catch (error) {
    console.error('Error updating appointment status:', error)
    init({ message: 'Failed to update appointment status', color: 'danger' })
  }
}
const getStatusText = (status: AppointmentStatus): string => {
  switch (status) {
    case AppointmentStatus.Scheduled:
      return 'Scheduled'
    case AppointmentStatus.Completed:
      return 'Completed'
    case AppointmentStatus.Cancelled:
      return 'Cancelled'
    case AppointmentStatus.Pending:
      return 'Pending'
    default:
      return 'Unknown'
  }
}
const getStatusClass = (status: AppointmentStatus): string => {
  switch (status) {
    case AppointmentStatus.Scheduled:
      return 'Scheduled'
    case AppointmentStatus.Completed:
      return 'Completed'
    case AppointmentStatus.Cancelled:
      return 'Cancelled'
    case AppointmentStatus.Pending:
      return 'Pending'
    default:
      return ''
  }
}
onMounted(() => {
  fetchAppointments()
})
const CreateDentalView = (id: string) => {
  appointmentStore.id = id
  router.push({ name: 'create' })
}
</script>

<template>
  <div class="appointment-list">
    <h1>Appointment List</h1>
    <div class="search-container">
      <input type="text" class="search-input" placeholder="Search..." />
    </div>
    <div class="table-container">
      <table class="appointment-table">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Dentist</th>
            <th>Appointment Date</th>
            <th>Type</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="appointment in appointments" :key="appointment.id">
            <td>{{ appointment.patient.fullName }}</td>
            <td>{{ appointment.dentist.fullName }}</td>
            <td>{{ appointment.date }}</td>
            <td>{{ appointment.type }}</td>
            <td>
              <select
                v-if="appointment.status === AppointmentStatus.Pending && authStore.hasAccess('Appointments.Update')"
                v-model="appointment.status"
                @change="updateAppointmentStatus(appointment)"
              >
                <option :value="AppointmentStatus.Scheduled">Scheduled</option>
                <option :value="AppointmentStatus.Cancelled">Cancelled</option>
                <option :value="AppointmentStatus.Pending">Pending</option>
              </select>
              <span v-else :class="['status', getStatusClass(appointment.status)]">
                {{ getStatusText(appointment.status) }}
              </span>
            </td>
            <td>
              <button
                v-if="authStore.hasAccess('Appointments.Update')"
                class="btn btn-update"
                @click="openPopup(appointment)"
              >
                Update
              </button>
              <span v-else> N/A </span>
              <button
                v-if="appointment.status === 0 && authStore.hasAccess('DentalRecords.Create')"
                class="btn btn-update"
                @click="CreateDentalView(appointment.id)"
              >
                Create Dental
              </button>
              <span v-else> N/A </span>
            </td>
          </tr>
          <tr v-if="appointments.length === 0">
            <td colspan="6" class="no-data">No appointments available</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showPopup && selectedAppointment" class="popup">
      <div class="popup-content">
        <h2>Update Appointment</h2>
        <div class="form-grid">
          <div class="form-group">
            <label for="patient">Patient:</label>
            <input id="patient" v-model="selectedAppointment.patient.fullName" />
          </div>
          <div class="form-group">
            <label for="dentist">Dentist:</label>
            <input id="dentist" v-model="selectedAppointment.dentist.fullName" />
          </div>
          <div class="form-group">
            <label for="date">Date:</label>
            <input id="date" v-model="selectedAppointment.date" type="date" />
          </div>
          <div class="form-group">
            <label for="timeSlot">Time Slot:</label>
            <input id="timeSlot" v-model="selectedAppointment.timeSlot" />
          </div>
          <div class="form-group">
            <label for="duration">Duration:</label>
            <input id="duration" v-model="selectedAppointment.duration" />
          </div>
          <div class="form-group">
            <label for="type">Type:</label>
            <input id="type" v-model="selectedAppointment.type" />
          </div>
          <div class="form-group">
            <label for="status">Status:</label>
            <input id="status" v-model="selectedAppointment.status" />
          </div>
        </div>
        <div class="button-group">
          <button class="btn btn-save" @click="updateAppointment">Save</button>
          <button class="btn btn-cancel" @click="closePopup">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.appointment-list {
  width: 100%;
  max-width: 100%;
  padding: 20px;
  box-sizing: border-box;
}

h1 {
  width: 100%;
  text-align: left;
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
}

.search-container {
  width: 100%;
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  box-sizing: border-box;
}

.table-container {
  width: 100%;
  overflow-x: auto;
}

.appointment-table {
  width: 100%;
  border-collapse: collapse;
}

.appointment-table th,
.appointment-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.appointment-table th {
  background-color: #f8f9fa;
  font-weight: bold;
  color: #333;
}

.appointment-table tr:hover {
  background-color: #f5f5f5;
}

.status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
}

.status.SCHEDULED {
  background-color: #d4edda;
  color: #155724;
}

.status.CANCELLED {
  background-color: #f8d7da;
  color: #721c24;
}

.status.COMPLETED {
  background-color: #cce5ff;
  color: #004085;
}

.btn {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.btn-update {
  background-color: #007bff;
  color: #fff;
}

.btn-update:hover {
  background-color: #0056b3;
}

.no-data {
  text-align: center;
  color: #6c757d;
  font-style: italic;
}

@media screen and (max-width: 768px) {
  .appointment-table {
    font-size: 14px;
  }

  .appointment-table th,
  .appointment-table td {
    padding: 8px;
  }

  .btn {
    padding: 6px 10px;
    font-size: 12px;
  }
}

.popup-content {
  background: #fff;
  padding: 30px;
  border-radius: 8px;
  max-width: 800px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.popup-content h2 {
  margin-bottom: 30px;
  color: #333;
  font-size: 24px;
  text-align: center;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  color: #000;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}

.btn {
  padding: 12px 24px;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-save {
  background-color: #28a745;
  color: white;
}

.btn-save:hover {
  background-color: #218838;
}

.btn-cancel {
  background-color: #dc3545;
  color: white;
}

.btn-cancel:hover {
  background-color: #c82333;
}
</style>
