<template>
  <div class="appointment-schedule max-w-md mx-auto p-4 border border-gray-300 rounded">
    <form class="space-y-4" @submit.prevent="handleSubmit">
      <div>
        <label for="patientID" class="block font-medium">Patient ID:</label>
        <input
          id="patientID"
          v-model="form.patientID"
          type="text"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded"
        />
      </div>

      <div>
        <label for="dentistID" class="block font-medium">Dentist ID:</label>
        <input
          id="dentistID"
          v-model="form.dentistID"
          type="text"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded"
        />
      </div>

      <div>
        <label for="clinicID" class="block font-medium">Clinic ID:</label>
        <input
          id="clinicID"
          v-model="form.clinicID"
          type="text"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded"
        />
      </div>
      <!-- <div>
        <label for="patientName" class="block font-medium">Patient Name:</label>
        <select id="patientName" v-model="form.patientName" required class="w-full px-3 py-2 border border-gray-300 rounded">
          <option v-for="(patient, index) in patients" :key="index" :value="patient">{{ patient }}</option>
        </select>
      </div>

      <div>
        <label for="dentistName" class="block font-medium">Dentist Name:</label>
        <select id="dentistName" v-model="form.dentistName" required class="w-full px-3 py-2 border border-gray-300 rounded">
          <option v-for="(dentist, index) in dentists" :key="index" :value="dentist">{{ dentist }}</option>
        </select>
      </div>

      <div>
        <label for="clinicName" class="block font-medium">Clinic Name:</label>
        <select id="clinicName" v-model="form.clinicName" required class="w-full px-3 py-2 border border-gray-300 rounded">
          <option v-for="(clinic, index) in clinics" :key="index" :value="clinic">{{ clinic }}</option>
        </select>
      </div> -->
      <div>
        <label for="timeSlot" class="block font-medium">Time Slot:</label>
        <input
          id="timeSlot"
          v-model="form.timeSlot"
          type="text"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded"
        />
      </div>

      <div>
        <label for="type" class="block font-medium">Type:</label>
        <select id="type" v-model="form.type" required class="w-full px-3 py-2 border border-gray-300 rounded">
          <option v-for="type in appointmentTypes" :key="type" :value="type">{{ type }}</option>
        </select>
      </div>

      <div>
        <label for="duration" class="block font-medium">Duration (minutes):</label>
        <input
          id="duration"
          v-model.number="form.duration"
          type="number"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded"
        />
      </div>

      <div>
        <label for="status" class="block font-medium">Status:</label>
        <select id="status" v-model="form.status" required class="w-full px-3 py-2 border border-gray-300 rounded">
          <option v-for="status in appointmentStatuses" :key="status" :value="status">{{ status }}</option>
        </select>
      </div>

      <div>
        <label for="date" class="block font-medium">Date:</label>
        <input
          id="date"
          v-model="form.date"
          type="date"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded"
        />
      </div>

      <div>
        <button type="submit" class="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Create Appointment
        </button>
      </div>
    </form>

    <p v-if="error" class="text-red-600 mt-4">{{ error }}</p>
  </div>
</template>

<script>
import { useAppointmentStore } from '@stores/modules/appointment.module'
import { AppointmentType, AppointmentStatus } from '@/pages/appointment/types'

export default {
  data() {
    return {
      form: {
        patientID: '',
        dentistID: '',
        clinicID: '',
        timeSlot: '',
        type: AppointmentType.Examination,
        duration: 0,
        status: AppointmentStatus.Scheduled,
        date: '',
      },
      error: null,
    }
  },
  computed: {
    appointmentTypes() {
      return Object.values(AppointmentType)
    },
    appointmentStatuses() {
      return Object.values(AppointmentStatus)
    },
  },
  methods: {
    async handleSubmit() {
      try {
        await useAppointmentStore().createAppointment(this.form)
        this.clearForm()
        // Optionally, navigate to another page or show success message
      } catch (error) {
        this.error = error.message || 'An error occurred while creating the appointment.'
      }
    },
    clearForm() {
      this.form = {
        patientID: '',
        dentistID: '',
        clinicID: '',
        timeSlot: '',
        type: AppointmentType.Examination,
        duration: 0,
        status: AppointmentStatus.Scheduled,
        date: '',
      }
    },
  },
}
</script>

<style scoped>
/* Optional: You can add additional scoped styles here if needed */
</style>
