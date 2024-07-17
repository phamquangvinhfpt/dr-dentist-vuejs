<template>
  <div class="update-dentist-container">
    <h1>Update Dentist</h1>

    <!-- Loading Indicator -->
    <div v-if="isLoading" class="loading">Updating...</div>

    <!-- Error Message -->
    <div v-if="error" class="error">{{ error }}</div>

    <!-- Update Dentist Form -->
    <form @submit.prevent="submitForm">
      <!-- Form fields for dentist details -->
      <input v-model="dentist.clinicId" placeholder="Clinic ID" required />
      <input v-model="dentist.degree" placeholder="Degree" required />
      <input v-model="dentist.institute" placeholder="Institute" required />
      <input v-model="dentist.specialization" placeholder="Specialization" required />
      <input v-model.number="dentist.yearOfExperience" type="number" placeholder="Years of Experience" required />

      <button type="submit">Update Dentist</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useDentistStore } from '@/stores/modules/dentist.module'

export default defineComponent({
  name: 'UpdateDentist',
  setup() {
    const route = useRoute()
    const dentistStore = useDentistStore()
    const dentist = reactive({
      dentistId: route.params.id as string,
      clinicId: '', // Ensure clinicId is included
      degree: '',
      institute: '',
      specialization: '',
      yearOfExperience: 0,
    })

    const loadDentist = async () => {
      try {
        const dentistData = await dentistStore.getDentistById(dentist.dentistId)
        Object.assign(dentist, dentistData)
      } catch (err) {
        dentistStore.setError('Failed to load dentist.')
      }
    }

    const submitForm = async () => {
      try {
        await dentistStore.updateDentist(dentist)
      } catch (err) {
        dentistStore.setError('Failed to update dentist.')
      }
    }

    onMounted(loadDentist)

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
.update-dentist-container {
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
