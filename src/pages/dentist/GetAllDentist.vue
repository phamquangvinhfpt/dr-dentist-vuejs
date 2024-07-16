<template>
  <div class="dentist-container">
    <h1>Available Dentists</h1>

    <!-- Loading Indicator -->
    <div v-if="isLoading" class="loading">Loading...</div>

    <!-- Error Message -->
    <div v-if="error" class="error">{{ error }}</div>

    <!-- Dentists List -->
    <ul v-if="!isLoading && !error">
      <li v-for="dentist in dentists" :key="dentist.dentistId" class="dentist-item">
        <div class="dentist-info">
          <p><strong>Dentist ID:</strong> {{ dentist.clinicId }}</p>
          <p><strong>Clinic ID:</strong> {{ dentist.clinicId }}</p>
          <p><strong>Degree:</strong> {{ dentist.degree }}</p>
          <p><strong>Institute:</strong> {{ dentist.institute }}</p>
          <p><strong>Specialization:</strong> {{ dentist.specialization }}</p>
          <p><strong>Years of Experience:</strong> {{ dentist.yearOfExperience }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue'
import { useDentistStore } from '@/stores/modules/dentist.module' // Ensure the path is correct

export default defineComponent({
  name: 'GetAllDentists',
  setup() {
    const dentistStore = useDentistStore()

    const fetchDentists = async () => {
      try {
        await dentistStore.getDentists() // Call the action to fetch dentists
      } catch (err) {
        dentistStore.setError('Failed to fetch dentists.')
      }
    }

    const scheduleAppointment = (dentistId: string) => {
      console.log(`Scheduling appointment with dentist ID: ${dentistId}`)
      // Add logic to handle scheduling (e.g., open a modal or redirect)
    }

    // Fetch data on component mount
    onMounted(fetchDentists)

    return {
      dentists: computed(() => dentistStore.dentists),
      isLoading: computed(() => dentistStore.isLoading),
      error: computed(() => dentistStore.error),
      scheduleAppointment,
    }
  },
})
</script>
<style scoped>
.dentist-container {
  padding: 20px;
  font-family: Arial, sans-serif;
}

.loading {
  font-size: 18px;
  color: #007bff;
}

.error {
  font-size: 18px;
  color: red;
}

.dentist-item {
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 10px;
  padding: 10px;
  display: flex;
  flex-direction: column; /* Adjusted for better readability */
}

.dentist-info {
  margin-bottom: 10px; /* Added margin for spacing */
}

.schedule-btn {
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 16px;
  align-self: flex-start; /* Align button to the start */
}

.schedule-btn:hover {
  background-color: #218838;
}
</style>
