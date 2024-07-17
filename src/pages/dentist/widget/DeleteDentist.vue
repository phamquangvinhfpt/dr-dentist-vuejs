<template>
  <div class="delete-dentist-container">
    <h1>Delete Dentist</h1>

    <!-- Loading Indicator -->
    <div v-if="isLoading" class="loading">Deleting...</div>

    <!-- Error Message -->
    <div v-if="error" class="error">{{ error }}</div>

    <!-- Delete Confirmation -->
    <div v-if="!isLoading && !error">
      <p>Are you sure you want to delete this dentist?</p>
      <button @click="deleteDentist">Yes, Delete</button>
      <button @click="cancelDelete">No, Cancel</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDentistStore } from '@/stores/modules/dentist.module'

export default defineComponent({
  name: 'DeleteDentist',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const dentistStore = useDentistStore()
    const dentistId = route.params.id as string

    const deleteDentist = async () => {
      try {
        await dentistStore.deleteDentist(dentistId)
        router.push({ name: 'dentist-list' })
      } catch (err) {
        dentistStore.setError('Failed to delete dentist.')
      }
    }

    const cancelDelete = () => {
      router.push({ name: 'dentist-list' })
    }

    return {
      isLoading: computed(() => dentistStore.isLoading),
      error: computed(() => dentistStore.error),
      deleteDentist,
      cancelDelete,
    }
  },
})
</script>

<style scoped>
.delete-dentist-container {
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

button {
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 16px;
  margin-right: 10px;
}

button:hover {
  background-color: #c82333;
}

button:last-child {
  background-color: #6c757d;
}

button:last-child:hover {
  background-color: #5a6268;
}
</style>
