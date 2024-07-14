<script lang="ts" setup>
import { useDentalStore } from '@stores/modules/dental.module'
import { useRouter } from 'vue-router'
import { onMounted, Ref, ref, reactive } from 'vue'
import { DentalFilterResponse, Dentals } from './types'

const dentalStore = useDentalStore()
const router = useRouter()

const formData = reactive({
  pageNumber: 1,
  search: '',
})
const dentalRecordsFilter: Ref<DentalFilterResponse | null> = ref(null)
const dentalRecords: Ref<Dentals[]> = ref([])

const getAllDental = async () => {
  try {
    const res = await dentalStore.GetDentalRecords(formData.pageNumber)
    dentalRecordsFilter.value = res
    dentalRecords.value = dentalRecordsFilter.value.data
  } catch (error) {
    console.error('Error fetching dental records:', error)
    dentalRecordsFilter.value = null
  }
}

// Function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

// Function to get appointment type
const getAppointmentType = (type: number) => {
  const types = ['Examination', 'Treatment', 'Reexamination', 'Periodic']
  return types[type] || 'Unknown'
}
const getAppointmentStatus = (type: number) => {
  const types = ['Scheduled', 'Completed', 'Cancelled', 'Pending']
  return types[type] || 'Unknown'
}

// Function to navigate to detail view
const viewDetails = (id: string) => {
  dentalStore.id = id
  router.push({ name: 'detail' })
}

// Fetch dental records on component mount
onMounted(() => {
  getAllDental()
})
</script>

<template>
  <div class="grid sm:grid-cols-2 md:grid-cols-5 gap-6 mb-6">
    <VaInput class="sm:col-span-2 md:col-span-3" placeholder="Search: " />
  </div>
  <div class="va-table-responsive">
    <table class="va-table" style="width: 100%; height: 500px">
      <thead>
        <tr>
          <th>Dentist</th>
          <th>Create At</th>
          <th>Patient</th>
          <th>Time Slot</th>
          <th>Type</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <!-- Loop through dental records and display them in table rows -->
        <tr v-for="record in dentalRecords" :key="record.id">
          <td>{{ record.dentist }}</td>
          <td>{{ formatDate(record.createdAt) }}</td>
          <td>{{ record.patient }}</td>
          <td>{{ record.timeSlot || 'N/A' }}</td>
          <td>{{ getAppointmentType(record.type) }}</td>
          <td>{{ getAppointmentStatus(record.status) }}</td>
          <td>
            <button class="btn btn-detail" @click="viewDetails(record.id)">Detail</button>
          </td>
        </tr>
        <!-- Display message if no data is available -->
        <tr v-if="dentalRecords.length === 0">
          <td colspan="5">No data available</td>
        </tr>
      </tbody>
      <!-- Pagination component -->
      <VaPagination
        v-model="formData.pageNumber"
        :pages="dentalRecordsFilter?.pageSize"
        @update:modelValue="getAllDental"
      />
    </table>
  </div>
</template>

<style>
.btn {
  padding: 6px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
}

.btn-detail {
  color: #007bff;
}

.va-table-responsive {
  overflow: auto;
}
</style>
