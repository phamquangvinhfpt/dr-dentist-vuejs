<template>
  <div class="dentist-container">
    <p style="font-weight: bold; margin-bottom: 15px; font-size: 24px; text-align: center">Available Dentists</p>

    <!-- Loading Indicator -->
    <div v-if="isLoading" class="loading">Loading...</div>

    <!-- Error Message -->
    <div v-if="error" class="error">{{ error }}</div>

    <!-- Success Message -->
    <div v-if="successMessage" class="success">{{ successMessage }}</div>

    <!-- Dentists List -->
    <ul v-if="!isLoading && !error">
      <li v-for="dentist in dentists" :key="dentist.id" class="dentist-item">
        <div class="dentist-info">
          <p><strong>Degree:</strong> {{ dentist.degree }}</p>
          <p><strong>Institute:</strong> {{ dentist.institute }}</p>
          <p><strong>Specialization:</strong> {{ dentist.specialization }}</p>
          <p><strong>Years of Experience:</strong> {{ dentist.yearOfExperience }}</p>
        </div>
        <button class="delete-btn" @click="confirmDelete(dentist.id)">Delete</button>
      </li>
    </ul>

    <!-- Update Form -->
    <div v-if="showUpdateForm" class="update-form">
      <p style="font-weight: bold; margin-bottom: 15px; font-size: 24px">Update Dentist</p>
      <form @submit.prevent="submitForm">
        <label>
          Dentist ID:
          <input v-model="dentist.dentistId" type="text" readonly />
        </label>
        <label>
          Dentist Detail ID:
          <input v-model="dentist.id" type="text" readonly />
        </label>
        <label>
          Clinic ID:
          <input v-model="dentist.clinicId" type="text" readonly />
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
import { useDentistStore } from '@/stores/modules/dentist.module'
import { DentistDetails } from '../types'

export default defineComponent({
  name: 'GetAllDentists',
  setup() {
    const dentistStore = useDentistStore()

    const fetchDentists = async () => {
      try {
        await dentistStore.getDentists()
      } catch (err) {
        dentistStore.setError('Failed to fetch dentists.')
      }
    }

    const dentist = reactive<DentistDetails>({
      dentistId: '',
      id: '',
      clinicId: '',
      degree: '',
      institute: '',
      specialization: '',
      yearOfExperience: 0,
    })

    const showUpdateForm = ref(false)
    const successMessage = ref('')
    const errorMessage = computed(() => dentistStore.error)

    const openUpdateForm = (selectedDentist: DentistDetails) => {
      Object.assign(dentist, selectedDentist)
      showUpdateForm.value = true
    }

    const submitForm = async () => {
      const confirmUpdate = confirm('Are you sure you want to update this dentist?')
      if (confirmUpdate) {
        try {
          await dentistStore.updateDentist(dentist)
          successMessage.value = 'Updated Successfully'
          showUpdateForm.value = false
          setTimeout(() => {
            successMessage.value = ''
          }, 2000)
        } catch (err) {
          dentistStore.setError('Failed to update dentist.')
        }
      }
    }

    const confirmDelete = (dentistDetailID: string) => {
      if (confirm('Are you sure you want to delete this dentist?')) {
        deleteDentist(dentistDetailID)
      }
    }

    const deleteDentist = async (dentistDetailID: string) => {
      try {
        await dentistStore.deleteDentist(dentistDetailID)
        successMessage.value = 'Deleted Successfully'
        await fetchDentists()
        setTimeout(() => {
          successMessage.value = ''
        }, 5000)
      } catch (err) {
        dentistStore.setError('Failed to delete dentist.')
      }
    }

    onMounted(fetchDentists)

    return {
      dentists: computed(() => dentistStore.dentists),
      isLoading: computed(() => dentistStore.isLoading),
      error: errorMessage,
      successMessage,
      dentist,
      showUpdateForm,
      openUpdateForm,
      submitForm,
      confirmDelete,
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

.success {
  font-size: 18px;
  color: green;
}

.dentist-item {
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 10px;
  padding: 10px;
  display: flex;
  flex-direction: column;
}

.dentist-info {
  margin-bottom: 10px;
}

.schedule-btn,
.delete-btn {
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 16px;
  margin-right: 10px;
}

.schedule-btn:hover {
  background-color: #218838;
}

.delete-btn {
  background-color: #dc3545;
}

.delete-btn:hover {
  background-color: #c82333;
}

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
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 16px;
}

.update-form button:hover {
  background-color: #218838;
}
</style>
