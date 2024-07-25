<script setup lang="ts">
import { ref, computed, onMounted, Ref, reactive, nextTick } from 'vue'
import { VaDataTable, VaSelect, useToast } from 'vuestic-ui'
import { usePermissionStore } from '@/stores/modules/permission.module'
import { useUserStore } from '@/stores/modules/user.module'

const { init } = useToast()
const store = usePermissionStore()
const userStore = useUserStore()
interface Permission {
  name: string
  Users: boolean
  DentalRecords: boolean
  Clinics: boolean
  Appointments: boolean
}
interface options {
  value: boolean
  label: string
}
const data: Ref<string[]> = ref([])
const columns = computed(() => [
  { key: 'name', label: 'Permission' },
  { key: 'Users', label: 'User' },
  { key: 'DentalRecords', label: 'Dental Record' },
  { key: 'Clinics', label: 'Clinic' },
  { key: 'Appointments', label: 'Appointment' },
])
const addPermissionByUSerID = async (action: string, resource: string) => {
  const id = userStore.id as string
  await store.AddPermissionByUserID(id, action, resource).then(() => {
    init({ message: store.message, color: 'success' })
  })
}
const deletePermissionByUSerID = async (action: string, resource: string) => {
  const id = userStore.id as string
  await store.DeletePermissionByUserID(id, action, resource).then(() => {
    init({ message: store.message, color: 'success' })
  })
}
const getPermissionByUser = async () => {
  const id = userStore.id as string
  const res = await store.GetPermissionByUserID(id)
  data.value = res
  console.log(data.value)
  permissions.forEach((permission) => {
    Object.keys(permission).forEach((key) => {
      if (key !== 'name') {
        permission[key as keyof Omit<Permission, 'name'>] = false
      }
    })
  })
  data.value.forEach((item) => {
    const [, resource, action] = item.split('.') as string[]
    const permissionIndex = ['View', 'Create', 'Update', 'Delete'].indexOf(action)
    if (permissionIndex !== -1 && resource in permissions[permissionIndex]) {
      permissions[permissionIndex][resource as keyof Omit<Permission, 'name'>] = true
    }
  })
  await nextTick()
}
const booleanOptions = reactive<options[]>([
  { value: true, label: 'True' },
  { value: false, label: 'False' },
])
const onChange = async (column: string, row: string, newValue: boolean) => {
  const permissionToUpdate = permissions.find((permission) => permission.name === row) as Permission
  if (permissionToUpdate[column as keyof Permission] !== newValue) {
    if (newValue === true) {
      await addPermissionByUSerID(row, column)
    } else {
      await deletePermissionByUSerID(row, column)
    }
    await getPermissionByUser()
  }
}
const permissions = reactive<Permission[]>([
  { name: 'View', Users: false, DentalRecords: false, Clinics: false, Appointments: false },
  { name: 'Create', Users: false, DentalRecords: false, Clinics: false, Appointments: false },
  { name: 'Update', Users: false, DentalRecords: false, Clinics: false, Appointments: false },
  { name: 'Delete', Users: false, DentalRecords: false, Clinics: false, Appointments: false },
])
const getLabel = (value: boolean) => {
  return booleanOptions.find((option) => option.value === value)?.label || ''
}
onMounted(() => {
  getPermissionByUser()
})
</script>

<template>
  <div>
    <VaDataTable
      class="my-table va-table--hoverable"
      :items="permissions"
      :columns="columns"
      hoverable
      :disable-client-side-sorting="false"
      :style="{
        '--va-data-table-thead-background': 'var(--va-background-element)',
        '--va-data-table-grid-tr-border': '1px solid var(--va-background-border)',
      }"
      sticky-header
      no-data-html="<div class='text-center'>No data found</div>"
    >
      <template #cell(name)="{ value }">
        <strong>{{ value }}</strong>
      </template>
      <template #cell(Users)="{ row, column }">
        <VaSelect
          :model-value="getLabel(row.rowData[column.key])"
          :options="booleanOptions"
          track-by="value"
          text-by="label"
          @update:modelValue="(newValue) => onChange(column.key, row.rowData.name, newValue.value)"
        />
      </template>
      <template #cell(DentalRecords)="{ row, column }">
        <VaSelect
          :model-value="getLabel(row.rowData[column.key])"
          :options="booleanOptions"
          track-by="value"
          text-by="label"
          @update:modelValue="(newValue) => onChange(column.key, row.rowData.name, newValue.value)"
        />
      </template>
      <template #cell(Clinics)="{ row, column }">
        <VaSelect
          :model-value="getLabel(row.rowData[column.key])"
          :options="booleanOptions"
          track-by="value"
          text-by="label"
          @update:modelValue="(newValue) => onChange(column.key, row.rowData.name, newValue.value)"
        />
      </template>
      <template #cell(Appointments)="{ row, column }">
        <VaSelect
          :model-value="getLabel(row.rowData[column.key])"
          :options="booleanOptions"
          track-by="value"
          text-by="label"
          @update:modelValue="(newValue) => onChange(column.key, row.rowData.name, newValue.value)"
        />
      </template>
    </VaDataTable>
  </div>
</template>
