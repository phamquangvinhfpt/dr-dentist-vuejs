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

onMounted(() => {
  fetchAppointments()
})
</script>

<template>
  <div class="appointment-list">
    <h1>Appointment List</h1>
    <div class="grid sm:grid-cols-2 md:grid-cols-5 gap-6 mb-6">
      <VaInput class="sm:col-span-2 md:col-span-3" placeholder="Search: " />
    </div>
    <div class="va-table-responsive">
      <table class="va-table">
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
            <td>{{ appointment.status }}</td>
            <td>
              <button class="btn" @click="openPopup(appointment)">Update</button>
            </td>
          </tr>
          <tr v-if="appointments.length === 0">
            <td colspan="6">No appointments available</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showPopup && selectedAppointment" class="popup">
      <div class="popup-content">
        <h2>Update Appointment</h2>
        <label>
          Patient:
          <input v-model="selectedAppointment.patient.fullName" />
        </label>
        <label>
          Dentist:
          <input v-model="selectedAppointment.dentist.fullName" />
        </label>
        <label>
          Date:
          <input v-model="selectedAppointment.date" type="date" />
        </label>
        <label>
          Time Slot:
          <input v-model="selectedAppointment.timeSlot" />
        </label>
        <label>
          Duration:
          <input v-model="selectedAppointment.duration" />
        </label>
        <label>
          Type:
          <input v-model="selectedAppointment.type" />
        </label>
        <label>
          Status:
          <input v-model="selectedAppointment.status" />
        </label>
        <button @click="updateAppointment">Save</button>
        <button @click="closePopup">Cancel</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn {
  padding: 6px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
}

.btn-detail {
  color: #007bff;
}

.va-table-responsive {
  overflow: auto;
}

.va-table {
  width: 100%;
  border-collapse: collapse;
}

.va-table th,
.va-table td {
  padding: 12px;
  border: 1px solid #000000;
  color: #ffffff;
}

.va-table th {
  background-color: #000000;
}

.popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup-content {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
}
</style>
