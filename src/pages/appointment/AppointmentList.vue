<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { useAppointmentStore } from '@stores/modules/appointment.module'
import { Appointment, AppointmentRequest } from './types'

const appointmentStore = useAppointmentStore()
const appointments = computed<Appointment[]>(() => appointmentStore.appointments)

const fetchAppointments = async () => {
  await appointmentStore.fetchAllAppointments()
}

const showPopup = ref(false)
const selectedAppointment = ref<Appointment | null>(null)
const showDeleteConfirmation = ref(false)
const appointmentToDelete = ref<string | null>(null)
const showUpdateConfirmation = ref(false)
const showMessage = ref(false)
const messageText = ref('')
const messageType = ref('')

const openPopup = (appointment: Appointment) => {
  selectedAppointment.value = appointment
  showPopup.value = true
}

const closePopup = () => {
  showPopup.value = false
  selectedAppointment.value = null
}

const openDeleteConfirmation = (id: string) => {
  appointmentToDelete.value = id
  showDeleteConfirmation.value = true
}

const closeDeleteConfirmation = () => {
  showDeleteConfirmation.value = false
  appointmentToDelete.value = null
}

const openUpdateConfirmation = () => {
  showUpdateConfirmation.value = true
}

const closeUpdateConfirmation = () => {
  showUpdateConfirmation.value = false
}

const showMessagePopup = (text: string, type: 'success' | 'error') => {
  messageText.value = text
  messageType.value = type
  showMessage.value = true
  setTimeout(() => {
    showMessage.value = false
  }, 3000)
}

const updateAppointment = async () => {
  if (selectedAppointment.value) {
    const appointmentRequest: AppointmentRequest = {
      patientID: selectedAppointment.value.patient.id,
      dentistID: selectedAppointment.value.dentist.id,
      clinicID: selectedAppointment.value.clinicID,
      date: selectedAppointment.value.date,
      timeSlot: selectedAppointment.value.timeSlot,
      duration: selectedAppointment.value.duration,
      type: selectedAppointment.value.type,
      status: selectedAppointment.value.status,
    }
    try {
      await appointmentStore.updateAppointment(selectedAppointment.value.id, appointmentRequest)
      fetchAppointments()
      closePopup()
      closeUpdateConfirmation()
      showMessagePopup('Change successful', 'success')
    } catch (error) {
      showMessagePopup('Something went wrong, please try again', 'error')
    }
  }
}

const confirmDeleteAppointment = async () => {
  if (appointmentToDelete.value) {
    await appointmentStore.deleteAppointment(appointmentToDelete.value)
    fetchAppointments()
    closeDeleteConfirmation()
  }
}

onMounted(() => {
  fetchAppointments()
})
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
              <span :class="['status', appointment.status]">
                {{ appointment.status }}
              </span>
            </td>
            <td>
              <button class="btn btn-update" @click="openPopup(appointment)">Update</button>
              <button class="btn btn-delete" @click="openDeleteConfirmation(appointment.id)">Delete</button>
            </td>
          </tr>
          <tr v-if="appointments.length === 0">
            <td colspan="6" class="no-data">No appointments available</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Update Appointment Popup -->
    <div v-if="showPopup && selectedAppointment" class="popup">
      <div class="popup-content">
        <h2>Update Appointment</h2>
        <div class="form-grid">
          <div class="form-group">
            <label for="patient">Patient:</label>
            <input id="patient" v-model="selectedAppointment.patient.fullName" readonly />
          </div>
          <div class="form-group">
            <label for="dentist">Dentist:</label>
            <input id="dentist" v-model="selectedAppointment.dentist.fullName" readonly />
          </div>
          <div class="form-group">
            <label for="date">Date:</label>
            <input id="date" v-model="selectedAppointment.date" type="date" />
          </div>
          <div class="form-group">
            <label for="timeSlot">Time Slot:</label>
            <input id="timeSlot" v-model="selectedAppointment.timeSlot" type="time" />
          </div>
          <div class="form-group">
            <label for="duration">Duration:</label>
            <input id="duration" v-model="selectedAppointment.duration" type="number" />
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
          <button class="btn btn-save" @click="openUpdateConfirmation">Save</button>
          <button class="btn btn-cancel" @click="closePopup">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Update Confirmation Popup -->
    <div v-if="showUpdateConfirmation" class="popup">
      <div class="popup-content">
        <h2>Confirm Update</h2>
        <p>Are you sure you want to update this appointment?</p>
        <div class="button-group">
          <button class="btn btn-update-confirm" @click="updateAppointment">Yes</button>
          <button class="btn btn-cancel" @click="closeUpdateConfirmation">No</button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Popup -->
    <div v-if="showDeleteConfirmation" class="popup">
      <div class="popup-content">
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to delete this appointment?</p>
        <div class="button-group">
          <button class="btn btn-delete-confirm" @click="confirmDeleteAppointment">Yes</button>
          <button class="btn btn-cancel" @click="closeDeleteConfirmation">No</button>
        </div>
      </div>
    </div>

    <!-- Message Popup -->
    <div v-if="showMessage" :class="['message-popup', messageType]">
      {{ messageText }}
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

.btn-delete {
  background-color: #dc3545;
  color: #fff;
  margin-left: 5px;
}

.btn-delete:hover {
  background-color: #c82333;
}

.btn-delete-confirm {
  background-color: #dc3545;
  color: #fff;
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

.popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
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

.popup-content p {
  text-align: center;
  margin-bottom: 30px;
  font-size: 18px;
  color: #333;
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
  background-color: #6c757d;
  color: white;
}

.btn-cancel:hover {
  background-color: #5a6268;
}

.btn-update-confirm {
  background-color: #28a745;
  color: white;
}

.btn-update-confirm:hover {
  background-color: #218838;
}

.message-popup {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 20px;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  z-index: 1000;
  animation: fadeInOut 3s ease-in-out;
}

.message-popup.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message-popup.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

@keyframes fadeInOut {
  0%,
  100% {
    opacity: 0;
  }
  10%,
  90% {
    opacity: 1;
  }
}
</style>
