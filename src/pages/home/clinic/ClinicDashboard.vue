<template>
  <div>
    <VaDataTable
      class="my-table va-table--hoverable"
      :items="modifiedDentalRecords"
      :columns="columns"
      :style="{
        '--va-data-table-thead-background': 'var(--va-background-element)',
        '--va-data-table-grid-tr-border': '1px solid var(--va-background-border)',
      }"
      sticky-header
    >
      <template #cell(viewDetails)="{}">
        <div v-for="clinic in dentalRecords" :key="clinic.ownerID" class="clinic-details">
          <VaButton
            preset="secondary"
            class="w-fit text-xs md:text-sm"
            size="small"
            @click="navigateToClinicDetails(clinic.clinicDetails)"
          >
            {{ t('View Details') }}
          </VaButton>
        </div>
      </template>
      <template #cell(edit)="{}">
        <div v-for="clinic in dentalRecords" :key="clinic.ownerID" class="clinic-details">
          <VaButton
            preset="secondary"
            class="w-fit text-xs md:text-sm"
            size="small"
            @click="selectClinicForEdit(clinic)"
          >
            {{ t('Edit') }}
          </VaButton>
        </div>
      </template>
      <template #cell(delete)="{}">
        <div v-for="clinic in dentalRecords" :key="clinic.ownerID" class="clinic-details">
          <div v-for="detail in clinic.clinicDetails" :key="detail.clinicID" class="clinic-details">
            <VaButton
              preset="secondary"
              class="w-fit text-xs md:text-sm"
              size="small"
              @click="deleteClinic(detail.clinicID)"
            >
              {{ t('Delete') }}
            </VaButton>
          </div>
        </div>
      </template>
    </VaDataTable>

    <VaButton @click="addNewClinic"> Add Clinic </VaButton>
    <div v-if="selectedClinic" class="add-detail-form">
      <h3>{{ selectedClinic.ownerID ? 'Edit Clinic' : 'Add Clinic' }}</h3>
      <VaForm ref="formRef" class="flex flex-col items-baseline gap-6">
        <VaInput v-model="userNames[selectedClinic.ownerID]" label="Owner" />
        <VaInput v-model="selectedClinic.address" label="Address" />
        <VaInput v-model="selectedClinic.name" label="Name" />
        <VaInput v-model="selectedClinic.verified" label="Last Name" />
        <div class="mt-8 flex w-full gap-3 background-element">
          <VaButton @click="saveClinic"> Save </VaButton>
          <VaButton @click="clearSelectedClinic"> Cancel </VaButton>
        </div>
      </VaForm>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { clinicProfileStore } from '@modules/clinic.module'
import { Clinic, DentalFilterResponse, ClinicDetail } from './types'
import { computed, onMounted, Ref, ref } from 'vue'
import { useUserProfileStore } from '@/stores/modules/user.module'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const dentalStore = clinicProfileStore()
const dentalRecords: Ref<Clinic[]> = ref([])
const dentalRecordsFilter: Ref<DentalFilterResponse | null> = ref(null)
const selectedClinic: Ref<Clinic | null> = ref(null)
const userProfileStore = useUserProfileStore()
const { t } = useI18n()
const router = useRouter()
const columns = computed(() => [
  { key: 'address', label: t('Address') },
  { key: 'owner', label: t('Owner') },
  { key: 'verified', label: t('Verified') },
  { key: 'name', label: t('Name') },
  { key: 'viewDetails', label: t('View Details') },
  { key: 'edit', label: t('Edit') },
  { key: 'delete', label: t('Delete') },
])

const userNames: Ref<{ [key: string]: string }> = ref({})

const modifiedDentalRecords: Ref<any[]> = ref([])

const getAllDental = async () => {
  try {
    await dentalStore.getAllClinics()
    dentalRecordsFilter.value = {
      pageNumber: 1, // giá trị giả
      pageSize: 10, // giá trị giả
      firstPage: '', // giá trị giả
      lastPage: '', // giá trị giả
      totalPages: 1, // giá trị giả
      totalRecords: dentalStore.clinics.length,
      nextPage: null,
      previousPage: null,
      data: dentalStore.clinics,
      succeeded: true,
      errors: null,
      message: null,
    }
    dentalRecords.value = dentalRecordsFilter.value.data
    await fetchUserNames()
    createModifiedDentalRecords()
  } catch (error) {
    console.error('Error fetching dental records:', error)
    dentalRecordsFilter.value = null
  }
}

const fetchUserNames = async () => {
  const promises = dentalRecords.value.map(async (clinic) => {
    if (clinic.ownerID && !userNames.value[clinic.ownerID]) {
      try {
        await userProfileStore.getUserById(clinic.ownerID)
        userNames.value[clinic.ownerID] = userProfileStore.userDetails?.fullName || 'Unknown'
      } catch (error) {
        console.error('Error fetching user details:', error)
        userNames.value[clinic.ownerID] = 'Unknown'
      }
    }
  })
  await Promise.all(promises)
}

const createModifiedDentalRecords = () => {
  modifiedDentalRecords.value = dentalRecords.value.map((record) => ({
    address: record.address,
    owner: userNames.value[record.ownerID],
    verified: record.verified,
    name: record.name,
    id: record.ownerID,
    clinicDetails: record.clinicDetails, // Thêm chi tiết phòng khám
  }))
}

const navigateToClinicDetails = (clinicDetail: ClinicDetail[]) => {
  console.log('check query', clinicDetail)
  router.push({
    name: 'clinic-detail',
    query: { clinicDetail: JSON.stringify(clinicDetail) },
  })
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
      const updatedClinic: Clinic = {
        id: selectedClinic.value.id || '', // Ensure the ID is included
        ownerID: selectedClinic.value.ownerID || '',
        name: selectedClinic.value.name || '',
        address: selectedClinic.value.address || '',
        verified: selectedClinic.value.verified || false,
        owner: selectedClinic.value.owner || { status: 0, birthDate: null, gender: 0, address: '', imageUrl: '' },
        createdAt: selectedClinic.value.createdAt || new Date(),
        updatedAt: new Date(), // Cập nhật ngày
        clinicDetails: selectedClinic.value.clinicDetails || [],
      }
      console.log('check update 1', updatedClinic)
      await dentalStore.updateClinic(updatedClinic)
    } else {
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
    await getAllDental() // Làm mới danh sách sau khi lưu
  } catch (error) {
    console.error('Error saving clinic:', error)
  }
}

const deleteClinic = async (clinicId: string) => {
  try {
    await dentalStore.deleteClinic(clinicId)
    await getAllDental() // Làm mới danh sách sau khi xóa
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
