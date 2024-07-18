<template>
  <div class="create-dentist-container">
    <h1>Create Dentist</h1>

    <!-- Loading Indicator -->
    <div v-if="isLoading" class="loading">Creating...</div>

    <!-- Error Message -->
    <div v-if="error" class="error">{{ error }}</div>

    <!-- Create Dentist Form -->
    <form @submit.prevent="submitForm">
      <!-- Form fields for dentist details -->
      <input v-model="dentist.dentistId" placeholder="Dentist ID" required />
      <input v-model="dentist.clinicId" placeholder="Clinic ID" required />
      <input v-model="dentist.degree" placeholder="Degree" required />
      <input v-model="dentist.institute" placeholder="Institute" required />
      <input v-model="dentist.specialization" placeholder="Specialization" required />
      <input v-model.number="dentist.yearOfExperience" type="number" placeholder="Years of Experience" required />

      <button type="submit">Create Dentist</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, computed } from 'vue'
import { useDentistStore } from '@/stores/modules/dentist.module'
import { DentistDetails } from '@/pages/dentist/types'

export default defineComponent({
  name: 'CreateDentist',
  setup() {
    const dentistStore = useDentistStore()
    const dentist = reactive<DentistDetails>({
      dentistId: '', // Add id property here
      clinicId: '',
      degree: '',
      institute: '',
      specialization: '',
      yearOfExperience: 0,
    })

    const submitForm = async () => {
      try {
        await dentistStore.createDentist(dentist)
      } catch (err) {
        dentistStore.setError('Failed to create dentist.')
      }
    }

    return {
      dentist,
      isLoading: computed(() => dentistStore.isLoading),
      error: computed(() => dentistStore.error),
      submitForm,
    }
  },
})
</script>

<style scoped>
.create-dentist-container {
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

form {
  display: flex;
  flex-direction: column;
}

input {
  margin-bottom: 10px;
  padding: 8px;
  font-size: 16px;
}

button {
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #218838;
}
</style>
