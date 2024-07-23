<script setup lang="ts">
import { ref, computed, onMounted, Ref, watch, reactive } from 'vue'
import { VaDataTable, VaSelect } from 'vuestic-ui'
import { usePermissionStore } from '@/stores/modules/permission.module'
import { useUserStore } from '@/stores/modules/user.module'

const store = usePermissionStore()
const userStore = useUserStore()
interface Permission {
  name: string
  user: boolean
  dentalRecord: boolean
  clinic: boolean
  appointment: boolean
}
interface options {
  value: boolean
  label: string
}
const data: Ref<string[]> = ref([])
const columns = computed(() => [
  { key: 'name', label: 'Permission' },
  { key: 'user', label: 'User' },
  { key: 'dentalRecord', label: 'Dental Record' },
  { key: 'clinic', label: 'Clinic' },
  { key: 'appointment', label: 'Appointment' },
])

const getPermissionByUser = async () => {
  const id = userStore.id as string
  const res = await store.GetPermissionByUserID(id)
  console.log('res', res)
  data.value = res
  console.log('array - permission', permissions[0]['name'])
  data.value.forEach((item) => {
    const items = item.split('.') as string[]
    if (items[2] === 'View') {
      if (items[1] === 'Users') {
        permissions[0]['user'] = true
      } else if (items[1] === 'DentalRecords') {
        permissions[0]['dentalRecord'] = true
      } else if (items[1] === 'Clinics') {
        permissions[0]['clinic'] = true
      } else if (items[1] === 'Appointments') {
        permissions[0]['appointment'] = true
      }
    } else if (items[2] === 'Create') {
      if (items[1] === 'Users') {
        permissions[0]['user'] = true
      } else if (items[1] === 'DentalRecords') {
        permissions[0]['dentalRecord'] = true
      } else if (items[1] === 'Clinics') {
        permissions[0]['clinic'] = true
      } else if (items[1] === 'Appointments') {
        permissions[0]['appointment'] = true
      }
    } else if (items[2] === 'Update') {
      if (items[1] === 'Users') {
        permissions[0]['user'] = true
      } else if (items[1] === 'DentalRecords') {
        permissions[0]['dentalRecord'] = true
      } else if (items[1] === 'Clinics') {
        permissions[0]['clinic'] = true
      } else if (items[1] === 'Appointments') {
        permissions[0]['appointment'] = true
      }
    } else if (items[2] === 'Delete') {
      if (items[1] === 'Users') {
        permissions[0]['user'] = true
      } else if (items[1] === 'DentalRecords') {
        permissions[0]['dentalRecord'] = true
      } else if (items[1] === 'Clinics') {
        permissions[0]['clinic'] = true
      } else if (items[1] === 'Appointments') {
        permissions[0]['appointment'] = true
      }
    }
  })
}
const booleanOptions = reactive<options[]>([
  { value: true, label: 'true' },
  { value: false, label: 'false' },
])
const onChange = (permission: string, action: string) => {
  console.log('permission: ', permission)
  console.log('action: ', action)
}
const permissions = reactive<Permission[]>([
  { name: 'View', user: false, dentalRecord: false, clinic: false, appointment: false },
  { name: 'Create', user: false, dentalRecord: false, clinic: false, appointment: false },
  { name: 'Update', user: false, dentalRecord: false, clinic: false, appointment: false },
  { name: 'Delete', user: false, dentalRecord: false, clinic: false, appointment: false },
])

onMounted(() => {
  getPermissionByUser()
})

watch(
  () => permissions,
  (newPermissions, oldPermissions) => {
    for (let i = 0; i < newPermissions.length; i++) {
      const newPermission = newPermissions[i]
      const oldPermission = oldPermissions[i]

      if (newPermission.user !== oldPermission.user) {
        console.log(`Thuộc tính user đã thay đổi từ ${oldPermission.user} thành ${newPermission.user}`)
      }
      if (newPermission.dentalRecord !== oldPermission.dentalRecord) {
        console.log(
          `Thuộc tính dentalRecord đã thay đổi từ ${oldPermission.dentalRecord} thành ${newPermission.dentalRecord}`,
        )
      }
      if (newPermission.clinic !== oldPermission.clinic) {
        console.log(`Thuộc tính clinic đã thay đổi từ ${oldPermission.clinic} thành ${newPermission.clinic}`)
      }
      if (newPermission.appointment !== oldPermission.appointment) {
        console.log(
          `Thuộc tính appointment đã thay đổi từ ${oldPermission.appointment} thành ${newPermission.appointment}`,
        )
      }
    }
  },
  { deep: true },
)
</script>

<template>
  <div>
    <VaCard>
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
        <template #cell(user)="{ row, column }">
          <VaSelect
            v-model="row.rowData[column.key]"
            :options="booleanOptions.map((option) => option.label)"
            label-by="label"
            value-by="value"
            @c="onChange(column.key, row.rowData['name'])"
          />
        </template>
        <template #cell(dentalRecord)="{ row, column }">
          <VaSelect
            v-model="row.rowData[column.key]"
            :options="booleanOptions.map((option) => option.label)"
            label-by="label"
            value-by="value"
            @change="onChange(column.key, row.rowData['name'])"
          />
        </template>
        <template #cell(clinic)="{ row, column }">
          <VaSelect
            v-model="row.rowData[column.key]"
            :options="booleanOptions.map((option) => option.label)"
            @change="onChange(column.key, row.rowData['name'])"
          />
        </template>
        <template #cell(appointment)="{ row, column }">
          <VaSelect
            v-model="row.rowData[column.key]"
            :options="booleanOptions.map((option) => option.label)"
            label-by="label"
            value-by="value"
            @change="onChange(column.key, row.rowData['name'])"
          />
        </template>
      </VaDataTable>
    </VaCard>
  </div>
</template>
