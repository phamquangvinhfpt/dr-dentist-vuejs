<script lang="ts" setup>
import { useDentalStore } from '@stores/modules/dental.module'
import { useRouter } from 'vue-router'
import { onMounted, Ref, ref, reactive, computed, watch } from 'vue'
import { DentalFilterResponse, Dentals } from './types'

const dentalStore = useDentalStore()
const router = useRouter()

const formData = reactive({
  pageNumber: 1,
  searchTerm: '',
  pageSize: 10,
  sortDesc: false,
  sortBy: '',
})
const dentalRecordsFilter: Ref<DentalFilterResponse | null> = ref(null)
const dentalRecords: Ref<Dentals[]> = ref([])

const getAllDentalAndSearch = async () => {
  try {
    let sortOrder = 'asc'
    if (formData.sortDesc) {
      sortOrder = 'desc'
    }
    const res = await dentalStore.GetDentalRecordAndSearch(
      formData.pageNumber,
      formData.pageSize,
      formData.searchTerm,
      sortOrder,
      formData.sortBy,
    )
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
const columns = computed(() => [
  { key: 'dentist', label: 'Dentist' },
  { key: 'createdAt', label: 'Create At' },
  { key: 'patient', label: 'Patient' },
  { key: 'timeSlot', label: 'Time Slot' },
  { key: 'type', label: 'Type' },
  { key: 'status', label: 'Status' },
  { key: 'action', label: 'Action' },
])
const sortOptions = [
  { value: 'dentist', text: 'Dentist' },
  { value: 'createdAt', text: 'Create At' },
  { value: 'patient', text: 'Patient' },
  { value: 'type', text: 'Type' },
]
const viewDetails = (id: string) => {
  dentalStore.id = id
  router.push({ name: 'detail' })
}
watch(
  () => formData.pageSize,
  (newPageSize) => {
    formData.pageSize = newPageSize
    getAllDentalAndSearch()
  },
)
watch(
  () => formData.searchTerm,
  (newSearch) => {
    formData.searchTerm = newSearch
    getAllDentalAndSearch()
  },
)
watch(
  () => dentalRecordsFilter.value?.pageNumber,
  (newPage) => {
    formData.pageNumber = newPage as number
    getAllDentalAndSearch()
  },
)
watch(
  () => formData.sortBy,
  (newSortBy) => {
    formData.sortBy = newSortBy
    getAllDentalAndSearch()
  },
)
watch(
  () => formData.sortDesc,
  (newSortDesc) => {
    formData.sortDesc = newSortDesc
    getAllDentalAndSearch()
  },
)
onMounted(() => {
  getAllDentalAndSearch()
})
</script>

<template>
  <div class="grid sm:grid-cols-2 md:grid-cols-5 gap-6 mb-6">
    <VaInput v-model="formData.searchTerm" class="sm:col-span-2 md:col-span-3" placeholder="Search: " />
    <VaSelect
      v-model="formData.sortBy"
      class="sm:col-span-1 md:col-span-1"
      :options="sortOptions.map((option) => option.value)"
      placeholder="Order By"
    />
    <div class="sm:col-span-1 md:col-span-1 flex items-center">
      <label class="mr-2">Descreasing</label>
      <input v-model="formData.sortDesc" type="checkbox" />
    </div>
  </div>
  <VaDataTable
    class="my-table va-table--hoverable"
    :items="dentalRecords"
    :columns="columns"
    hoverable
    select-mode="multiple"
    :disable-client-side-sorting="false"
    :style="{
      '--va-data-table-thead-background': 'var(--va-background-element)',
      '--va-data-table-grid-tr-border': '1px solid var(--va-background-border)',
    }"
    sticky-header
    no-data-html="<div class='text-center'>No data found</div>"
  >
    <template #cell(dentist)="{ row }">
      <div class="flex items-center gap-2 ellipsis max-w-[230px]">
        <span class="w-24">{{ row.rowData.dentist }}</span>
      </div>
    </template>
    <template #cell(createdAt)="{ row }">
      <div class="flex items-center gap-2 ellipsis max-w-[230px]">
        <span class="w-24">{{ formatDate(row.rowData.createdAt) }}</span>
      </div>
    </template>
    <template #cell(patient)="{ row }">
      <div class="flex items-center gap-2 ellipsis max-w-[230px]">
        <span class="w-24">{{ row.rowData.patient }}</span>
      </div>
    </template>
    <template #cell(timeSlot)="{ row }">
      <div class="flex items-center gap-2 ellipsis max-w-[230px]">
        <span class="w-24">{{ row.rowData.timeSlot || 'N/A' }}</span>
      </div>
    </template>
    <template #cell(type)="{ row }">
      <div class="flex items-center gap-2 ellipsis max-w-[230px]">
        <span class="w-24">{{ getAppointmentType(row.rowData.type) }}</span>
      </div>
    </template>
    <template #cell(status)="{ row }">
      <div class="flex items-center gap-2 ellipsis max-w-[230px]">
        <span class="w-24">{{ getAppointmentStatus(row.rowData.status) }}</span>
      </div>
    </template>
    <template #cell(action)="{ row }">
      <button class="btn btn-detail" @click="viewDetails(row.rowData.id)">Detail</button>
    </template>
  </VaDataTable>
  <VaCardContent>
    <div v-if="dentalRecordsFilter" class="flex flex-col-reverse md:flex-row gap-2 justify-between items-center p-2">
      <div>
        <b>{{ dentalRecordsFilter.totalRecords }} {{ 'Result' }}.</b>
        {{ 'Result per page' }}
        <VaSelect v-model="formData.pageSize" class="!w-20" :options="[10, 50, 100]" />
      </div>
      <div v-if="dentalRecordsFilter.totalPages > 1" class="flex">
        <VaPagination
          v-model="dentalRecordsFilter.pageNumber"
          buttons-preset="secondary"
          :pages="dentalRecordsFilter.totalPages"
          :visible-pages="5"
          :boundary-links="true"
          :direction-links="true"
        />
      </div>
    </div>
  </VaCardContent>
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
