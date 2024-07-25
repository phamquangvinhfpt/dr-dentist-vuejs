<template>
  <div class="clinic-details-container">
    <h1 class="title">Clinic Details</h1>
    <div v-if="clinicDetails.length">
      <div v-for="detail in clinicDetails" :key="detail.clinicID" class="clinic-card">
        <ul class="clinic-info">
          <li><strong>Day of the Week:</strong> {{ detail.dayOfTheWeek }}</li>
          <li><strong>Opening Time:</strong> {{ detail.openingTime }}</li>
          <li><strong>Closing Time:</strong> {{ detail.closingTime }}</li>
          <li><strong>Slot Duration:</strong> {{ detail.slotDuration }} mins</li>
          <li><strong>Max Patients Per Slot:</strong> {{ detail.maxPatientsPerSlot }}</li>
        </ul>
      </div>
    </div>
    <p v-else>No Calendar</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const clinicDetails = ref([])

onMounted(() => {
  const clinicDetailsQuery = route.query.clinicDetail
  if (clinicDetailsQuery) {
    try {
      const parsedData = JSON.parse(clinicDetailsQuery)
      clinicDetails.value = parsedData.clinicDetails || []
      console.log('Parsed clinicDetails:', clinicDetails.value)
    } catch (e) {
      console.error('Failed to parse clinicDetails:', e)
    }
  }
})
</script>

<style scoped>
.clinic-details-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.title {
  text-align: center;
  font-size: 2em;
  margin-bottom: 20px;
}

.clinic-card {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.clinic-info {
  list-style: none;
  padding: 0;
}

.clinic-info li {
  margin-bottom: 10px;
  font-size: 1em;
}

.clinic-info strong {
  display: inline-block;
  width: 150px;
  color: #333;
}
</style>
