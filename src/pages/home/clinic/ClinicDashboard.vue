<script lang="ts" setup>
import { clinicProfileStore } from '@modules/clinic.module'
import { Clinic, DentalFilterResponse } from './types'
import { onMounted, Ref, ref } from 'vue'
import { useUserProfileStore } from '@/stores/modules/user.module'

const dentalStore = clinicProfileStore()
const dentalRecords: Ref<Clinic[]> = ref([])
const dentalRecordsFilter: Ref<DentalFilterResponse | null> = ref(null)
const selectedClinic: Ref<Clinic | null> = ref(null)
const userProfileStore = useUserProfileStore()

const userNames: Ref<{ [key: string]: string }> = ref({})
const getAllDental = async () => {
  try {
    await dentalStore.getAllClinics()
    dentalRecordsFilter.value = {
      pageNumber: 1, // dummy value
      pageSize: 10, // dummy value
      firstPage: '', // dummy value
      lastPage: '', // dummy value
      totalPages: 1, // dummy value
      totalRecords: dentalStore.clinics.length,
      nextPage: null,
      previousPage: null,
      data: dentalStore.clinics,
      succeeded: true,
      errors: null,
      message: null,
    }
    dentalRecords.value = dentalRecordsFilter.value.data
    fetchUserNames()
  } catch (error) {
    console.error('Error fetching dental records:', error)
    dentalRecordsFilter.value = null
  }
}
const fetchUserNames = async () => {
  for (const clinic of dentalRecords.value) {
    if (clinic.ownerID && !userNames.value[clinic.ownerID]) {
      try {
        await userProfileStore.getUserById(clinic.ownerID)
        userNames.value[clinic.ownerID] = userProfileStore?.userDetails?.fullName || 'Unknown'
      } catch (error) {
        console.error('Error fetching user details:', error)
        userNames.value[clinic.ownerID] = 'Unknown'
      }
    }
  }
}

const selectClinicForEdit = (clinic: Clinic) => {
  selectedClinic.value = { ...clinic }
  dentalStore.selectClinic(clinic)
}

const clearSelectedClinic = () => {
  selectedClinic.value = null
  dentalStore.clearSelectedClinic()
}

const saveClinic = async () => {
  try {
    if (selectedClinic.value?.ownerID) {
      // Ensure the clinic object contains all required fields
      const updatedClinic: Clinic = {
        id: selectedClinic.value.id || '', // Ensure the ID is included
        ownerID: selectedClinic.value.ownerID || '',
        name: selectedClinic.value.name || '',
        address: selectedClinic.value.address || '',
        verified: selectedClinic.value.verified || false,
        owner: selectedClinic.value.owner || { status: 0, birthDate: null, gender: 0, address: '', imageUrl: '' },
        createdAt: selectedClinic.value.createdAt || new Date(),
        updatedAt: new Date(), // Update the date
        clinicDetails: selectedClinic.value.clinicDetails || [],
      }
      await dentalStore.updateClinic(updatedClinic)
    } else {
      // Ensure the clinic object contains all required fields for a new clinic
      const newClinic: Clinic = {
        id: '', // Empty or auto-generated ID for new clinic
        ownerID: '', // Empty or auto-generated ID for new clinic
        name: selectedClinic.value?.name || '',
        address: selectedClinic.value?.address || '',
        verified: selectedClinic.value?.verified || false,
        owner: selectedClinic.value?.owner || { status: 0, birthDate: null, gender: 0, address: '', imageUrl: '' },
        createdAt: new Date(),
        updatedAt: new Date(),
        clinicDetails: selectedClinic.value?.clinicDetails || [],
      }
      await dentalStore.addClinic(newClinic)
    }
    clearSelectedClinic()
    await getAllDental() // Refresh the list after saving
  } catch (error) {
    console.error('Error saving clinic:', error)
  }
}

const deleteClinic = async (clinicId: string) => {
  try {
    await dentalStore.deleteClinic(clinicId)
    await getAllDental() // Refresh the list after deletion
  } catch (error) {
    console.error('Error deleting clinic:', error)
  }
}

const addNewClinic = () => {
  selectedClinic.value = {
    id: '', // Empty or auto-generated ID for new clinic
    ownerID: '',
    name: '',
    address: '',
    verified: false,
    owner: {
      status: 0,
      birthDate: null,
      gender: 0,
      address: '',
      imageUrl: '',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    clinicDetails: [],
  }
}

onMounted(() => {
  getAllDental()
})
</script>

<template>
  <div class="clinic-profile">
    <button class="btn add-clinic-btn" @click="addNewClinic">Add Clinic</button>

    <div v-for="clinic in dentalRecords" :key="clinic.ownerID" class="clinic-details">
      <p><strong>Address:</strong> {{ clinic.address }}</p>
      <p><strong>Owner:</strong> {{ userNames[clinic.ownerID] }}</p>
      <p><strong>Verified:</strong> {{ clinic.verified ? 'Yes' : 'No' }}</p>
      <p><strong>Name:</strong> {{ clinic.name }}</p>

      <h3>Clinic Details</h3>
      <ul>
        <li v-for="detail in clinic.clinicDetails" :key="detail.clinicID">
          <strong>{{ detail.dayOfTheWeek }}:</strong> {{ detail.openingTime }} - {{ detail.closingTime }} (Slot
          Duration: {{ detail.slotDuration }} mins, Max Patients per Slot: {{ detail.maxPatientsPerSlot }})
          <button class="btn" @click="selectClinicForEdit(clinic)">Edit</button>
          <button class="btn" @click="deleteClinic(detail.clinicID)">Delete</button>
        </li>
      </ul>
    </div>

    <div v-if="selectedClinic" class="add-detail-form">
      <h3>{{ selectedClinic.ownerID ? 'Edit Clinic' : 'Add Clinic' }}</h3>
      <label>
        Owner:
        <input v-model="userNames[selectedClinic.ownerID]" type="text" />
      </label>
      <label>
        Address:
        <input v-model="selectedClinic.address" type="text" />
      </label>
      <label>
        Name:
        <input v-model="selectedClinic.name" type="text" />
      </label>
      <label>
        Verified:
        <input v-model="selectedClinic.verified" type="checkbox" />
      </label>
      <button class="btn" @click="saveClinic">{{ selectedClinic.ownerID ? 'Update' : 'Add' }}</button>
      <button class="btn" @click="clearSelectedClinic">Cancel</button>
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

.add-clinic-btn {
  margin-bottom: 20px;
}

.owner-image {
  max-width: 150px;
  border-radius: 50%;
  margin-top: 10px;
}
</style>
