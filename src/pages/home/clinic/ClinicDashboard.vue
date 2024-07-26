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
      <template #cell(clinicDetails)="{ row }">
        <VaButton
          preset="secondary"
          class="w-fit text-xs md:text-sm"
          size="small"
          @click="navigateToClinicDetails(row.rowData)"
        >
          {{ t('View Details') }}
        </VaButton>
      </template>
      <template #cell(edit)="{ row }">
        <div v-for="clinic in dentalRecords" :key="clinic.ownerID" class="clinic-details">
          <div v-if="clinic.id == row.rowData?.id2">
            <VaButton
              v-if="authStore.hasAccess('Clinics.Update') && authStore.user?.roles === 'SuperAdmin'"
              preset="secondary"
              class="w-fit text-xs md:text-sm"
              size="small"
              @click="selectClinicForEdit(clinic)"
            >
              {{ t('Edit') }}
            </VaButton>
          </div>
        </div>
      </template>
      <template #cell(delete)="{ row }">
        <VaButton
          v-if="authStore.hasAccess('Clinics.Update') && authStore.user?.roles === 'SuperAdmin'"
          preset="secondary"
          class="w-fit text-xs md:text-sm"
          size="small"
          @click="deleteClinic(row.rowData.id2)"
        >
          {{ t('Delete') }}
        </VaButton>
      </template>
    </VaDataTable>

    <VaButton
      v-if="authStore.hasAccess('Clinics.Create') && authStore.user?.roles === 'ClinicOwner'"
      @click="addNewClinic"
    >
      Add Clinic
    </VaButton>

    <div v-if="selectedClinic" class="add-detail-form">
      <VaForm ref="formRef" class="flex flex-col items-baseline gap-6">
        <VaInput
          v-if="authStore.hasAccess('Clinics.Update') && authStore.user?.roles === 'SuperAdmin'"
          v-model="userNames[selectedClinic.ownerID]"
          label="Owner"
        />
        <VaInput v-model="selectedClinic.address" label="Address" />
        <VaInput v-model="selectedClinic.name" label="Name" />
        <VaInput
          v-if="authStore.hasAccess('Clinics.Update') && authStore.user?.roles === 'ClinicOwner'"
          readonly
          :model-value="selectedClinic.verified !== undefined ? selectedClinic.verified.toString() : ''"
          label="Verify"
        />
        <VaSelect v-else v-model="selectedClinic.verified" :options="verifiedOptions" label="Verify" />
        <div class="mt-8 flex w-full gap-3 background-element">
          <VaButton @click="saveClinic">Save</VaButton>
          <VaButton @click="clearSelectedClinic">Cancel</VaButton>
        </div>
      </VaForm>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { clinicProfileStore } from '@modules/clinic.module'
import { Clinic, DentalFilterResponse, ClinicDetail, ClinicRequest } from './types'
import { computed, onMounted, Ref, ref } from 'vue'
import { useUserProfileStore } from '@/stores/modules/user.module'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/modules/auth.module'
const authStore = useAuthStore()
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
  { key: 'clinicDetails', label: t('View Details') },
  { key: 'edit', label: t('Edit') },
  { key: 'delete', label: t('Delete') },
])
const verifiedOptions = [
  { text: 'True', value: true },
  { text: 'False', value: false },
]
const userNames: Ref<{ [key: string]: string }> = ref({})

const modifiedDentalRecords: Ref<any[]> = ref([])

const getAllDental = async () => {
  try {
    await dentalStore.getAllClinics()
    dentalRecordsFilter.value = {
      pageNumber: 1,
      pageSize: 10,
      firstPage: '',
      lastPage: '',
      totalPages: 1,
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
    id2: record.id,
    address: record.address,
    owner: userNames.value[record.ownerID],
    verified: record.verified,
    name: record.name,
    clinicDetails: record.clinicDetails,
    edit: record.clinicDetails,
    delete: record.id,
  }))
}

const navigateToClinicDetails = (clinicDetail: ClinicDetail[]) => {
  console.log('dental', clinicDetail)
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
        verified: true,
        owner: selectedClinic.value.owner || { status: 0, birthDate: null, gender: 0, address: '', imageUrl: '' },
        createdAt: selectedClinic.value.createdAt || new Date(),
        updatedAt: new Date(), // Cập nhật ngày
        clinicDetails: selectedClinic.value.clinicDetails || [],
      }

      await dentalStore.updateClinic(updatedClinic)
    } else {
      const newClinic: ClinicRequest = {
        ownerID: authStore.user?.id as string, // Empty or auto-generated ID for new clinic
        name: selectedClinic.value?.name || '',
        address: selectedClinic.value?.address || '',
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
