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
          <p><strong>Dentist ID:</strong> {{ dentist.dentistId }}</p>
          <p><strong>Clinic ID:</strong> {{ dentist.clinicId }}</p>
          <p><strong>Degree:</strong> {{ dentist.degree }}</p>
          <p><strong>Institute:</strong> {{ dentist.institute }}</p>
          <p><strong>Specialization:</strong> {{ dentist.specialization }}</p>
          <p><strong>Years of Experience:</strong> {{ dentist.yearOfExperience }}</p>
        </div>
        <button class="schedule-btn" @click="openUpdateForm(dentist)">Update</button>
      </li>
    </ul>

    <!-- Update Form -->
    <div v-if="showUpdateForm" class="update-form">
      <h2>Update Dentist</h2>
      <form @submit.prevent="submitForm">
        <label>
          Dentist ID:
          <input v-model="dentist.dentistId" type="text" readonly />
        </label>
        <label>
          Clinic ID:
          <input v-model="dentist.clinicId" type="text" />
        </label>
        <label>
          Degree:
          <input v-model="dentist.degree" type="text" />
        </label>
        <label>
          Institute:
          <input v-model="dentist.institute" type="text" />
        </label>
        <label>
          Specialization:
          <input v-model="dentist.specialization" type="text" />
        </label>
        <label>
          Years of Experience:
          <input v-model.number="dentist.yearOfExperience" type="number" />
        </label>
        <button type="submit" class="schedule-btn">Submit</button>
      </form>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed, onMounted, reactive, ref } from 'vue'
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

    const dentist = reactive({
      dentistId: '',
      clinicId: '',
      degree: '',
      institute: '',
      specialization: '',
      yearOfExperience: 0,
    })

    const showUpdateForm = ref(false)

    const openUpdateForm = (selectedDentist: any) => {
      Object.assign(dentist, selectedDentist)
      showUpdateForm.value = true
    }

    const submitForm = async () => {
      try {
        console.log('data : ', dentist.dentistId)
        await dentistStore.updateDentist(dentist)
        showUpdateForm.value = false
      } catch (err) {
        dentistStore.setError('Failed to update dentist.')
      }
    }

    // Fetch data on component mount
    onMounted(fetchDentists)

    return {
      dentists: computed(() => dentistStore.dentists),
      isLoading: computed(() => dentistStore.isLoading),
      error: computed(() => dentistStore.error),
      dentist,
      showUpdateForm,
      openUpdateForm,
      submitForm,
    }
  },
})
</script>

<style scoped>
.update-form {
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.update-form h2 {
  margin-bottom: 15px;
}

.update-form label {
  display: block;
  margin-bottom: 10px;
}

.update-form input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.update-form button {
  margin-top: 10px;
}
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
