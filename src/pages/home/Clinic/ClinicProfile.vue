<script lang="ts" setup>
import { clinicProfileStore } from '@modules/clinic.module'
import { Clinic, DentalFilterResponse } from './types'
import { onMounted, Ref, ref } from 'vue'

const dentalStore = clinicProfileStore()
const dentalRecords: Ref<Clinic[]> = ref([])
const dentalRecordsFilter: Ref<DentalFilterResponse | null> = ref(null)

const getAllDental = async () => {
  try {
    const res = await dentalStore.getClinicProfile()
    dentalRecordsFilter.value = res
    console.log('data:', dentalRecordsFilter.value)
    dentalRecords.value = dentalRecordsFilter.value.data
    console.log('rep-data', dentalRecords.value)
  } catch (error) {
    console.error('Error fetching dental records:', error)
    dentalRecordsFilter.value = null
  }
}
onMounted(() => {
  getAllDental()
})
</script>
<template>
  <div class="clinic-profile">
    <div v-for="clinic in dentalRecords" :key="clinic.ownerID" class="clinic-details">
      <p><strong>Address:</strong> {{ clinic.address }}</p>
      <p><strong>Verified:</strong> {{ clinic.verified ? 'Yes' : 'No' }}</p>
      <div v-if="clinic.owner" class="owner-details">
        <h3>Owner Details</h3>
        <p><strong>Status:</strong> {{ clinic.owner.status }}</p>
        <p>
          <strong>Birth Date:</strong>
          {{ clinic.owner.birthDate ? new Date(clinic.owner.birthDate).toLocaleDateString() : 'N/A' }}
        </p>
        <p><strong>Gender:</strong> {{ clinic.owner.gender }}</p>
        <p><strong>Address:</strong> {{ clinic.owner.address }}</p>
        <img v-if="clinic.owner.imageUrl" :src="clinic.owner.imageUrl" alt="Owner Image" class="owner-image" />
      </div>

      <h3>Clinic Details</h3>
      <ul>
        <li v-for="detail in clinic.clinicDetails" :key="detail.clinicID">
          <strong>Time:</strong> {{ detail.openingTime }} - {{ detail.closingTime }} (Slot Duration:
          {{ detail.slotDuration }} mins, Max Patients per Slot: {{ detail.maxPatientsPerSlot }})
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.clinic-profile {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.clinic-details {
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 8px;
}

.clinic-details h2 {
  margin-top: 0;
}

.clinic-details ul {
  list-style: none;
  padding: 0;
}

.clinic-details li {
  margin-bottom: 10px;
}

.add-detail-form {
  margin-top: 20px;
}

.add-detail-form label {
  display: block;
  margin-bottom: 10px;
}

.add-detail-form input {
  display: block;
  margin-bottom: 10px;
}

.btn {
  display: inline-block;
  padding: 10px 20px;
  font-size: 16px;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: #0056b3;
}

.owner-image {
  max-width: 150px;
  border-radius: 50%;
  margin-top: 10px;
}
</style>
