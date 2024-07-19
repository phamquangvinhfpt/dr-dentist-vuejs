<script lang="ts" setup>
import { onMounted, computed } from 'vue'
import { useAppointmentStore } from '@stores/modules/appointment.module'
import { Appointment } from './types'

const appointmentStore = useAppointmentStore()
const appointments = computed<Appointment[]>(() => appointmentStore.appointments)

const fetchAppointments = async () => {
  await appointmentStore.fetchAllAppointments()
}

const viewDetails = (id: string) => {
  // Logic for viewing details of an appointment
  console.log(`Viewing details for appointment ID: ${id}`)
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
              <button class="btn btn-detail" @click="viewDetails(appointment.id)">Details</button>
            </td>
          </tr>
          <tr v-if="appointments.length === 0">
            <td colspan="6">No appointments available</td>
          </tr>
        </tbody>
      </table>
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
</style>
