<template>
  <div class="create-dentist-container">
    <p style="text-align: center; font-weight: bold; font-size: 24px">Create Dentist</p>

    <!-- Loading Indicator -->
    <div v-if="isLoading" class="loading">Creating...</div>

    <!-- Error Message -->
    <div v-if="error" class="error">{{ error }}</div>

    <!-- Success Message -->
    <div v-if="successMessage" class="success">{{ successMessage }}</div>

    <!-- Create Dentist Form -->
    <form @submit.prevent="submitForm">
      <!-- Form fields for dentist details -->
      <div class="form-group">
        <label for="name">Dentist Id:</label>
        <select>
          <option value="" disabled>Select Dentist</option>
          <option>Id dentist</option>
        </select>
      </div>
      <div class="form-group">
        <input v-model="dentist.clinicId" placeholder="Clinic ID" required />
      </div>
      <div class="form-group">
        <input v-model="dentist.degree" placeholder="Degree" required />
      </div>
      <div class="form-group">
        <input v-model="dentist.institute" placeholder="Institute" required />
      </div>
      <div class="form-group">
        <input v-model="dentist.specialization" placeholder="Specialization" required />
      </div>
      <div class="form-group">
        <input v-model.number="dentist.yearOfExperience" type="number" placeholder="Years of Experience" required />
      </div>

      <button type="submit">Create Dentist</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, computed } from 'vue'
import { useDentistStore } from '@/stores/modules/dentist.module'
import { DentistDetails } from '@/pages/dentist/types'

export default defineComponent({
  name: 'CreateDentist',
  setup() {
    const dentistStore = useDentistStore()
    const dentist = reactive<DentistDetails>({
      dentistId: '',
      clinicId: '',
      degree: '',
      institute: '',
      specialization: '',
      yearOfExperience: 0,
    })

    const successMessage = ref('')

    const submitForm = async () => {
      try {
        await dentistStore.createDentist(dentist)
        successMessage.value = 'Created Successfully'
        // Clear the form fields after successful creation if needed
        Object.assign(dentist, {
          dentistId: '',
          clinicId: '',
          degree: '',
          institute: '',
          specialization: '',
          yearOfExperience: 0,
        })
        // Show success message for 2 seconds
        setTimeout(() => {
          successMessage.value = ''
        }, 2000)
      } catch (err) {
        dentistStore.setError('Failed to create dentist.')
      }
    }
    return {
      dentist,
      isLoading: computed(() => dentistStore.isLoading),
      error: computed(() => dentistStore.error),
      successMessage,
      submitForm,
    }
  },
})
</script>

<style scoped>
.create-dentist-container {
  margin: 0 auto;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: #f9f9f9;
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

.success {
  font-size: 18px;
  color: green;
}

form {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 40px;
  width: 100%;
  height: auto;
}

input {
  margin-bottom: 20px;
  padding: 12px;
  font-size: 16px;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 16px;
  margin-bottom: 20px;
}

button:hover {
  background-color: #218838;
}

form-group {
  margin: 20px;
}
</style>
