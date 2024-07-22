<template>
  <VaDataTable
    class="min-h-[75vh]"
    hoverable
    clickable
    selectable
    :columns="columns"
    select-mode="multiple"
    :items="props.dentist"
    :disable-client-side-sorting="false"
    @row:dblclick="dblclick($event)"
    @row:contextmenu="contextmenu($event)"
    @selectionChange="handleSelectionChange($event.currentSelectedItems)"
  >
    <template #cell(dentistId)="{ rowData }">
      <div class="ellipsis max-w-[230px] lg:max-w-[450px]">
        <div>
          <span>{{ users.find((user) => user.id === rowData.dentistId)?.fullName }}</span>
        </div>
      </div>
    </template>
    <template #cell(clinicId)="{ rowData }">
      <div class="ellipsis max-w-[230px] lg:max-w-[450px]">
        <div>
          <span>{{ clinics.find((clinic) => clinic.id === rowData.clinicId)?.name }}</span>
        </div>
      </div>
    </template>

    <template #cell(actions)="{ rowData: dentist }">
      <div class="flex gap-2 justify-end">
        <VaButton
          preset="primary"
          size="small"
          color="primary"
          icon="mso-edit"
          :aria-label="t('dentists.edit_dentist')"
          @click="emit('edit', dentist as Dentist)"
        />
        <VaButton
          preset="primary"
          size="small"
          icon="mso-delete"
          color="danger"
          :aria-label="t('dentists.delete_dentist')"
          @click="emit('delete', dentist as Dentist)"
        />
      </div>
    </template>
  </VaDataTable>
</template>

<script setup lang="ts">
import { onMounted, PropType, ref } from 'vue'
import { defineVaDataTableColumns, useMenu, useToast } from 'vuestic-ui'
import { useI18n } from 'vue-i18n'
import { Dentist } from '../types'
import { UserDetail } from '@/pages/user/types'
import { Clinic } from '@/pages/home/clinic/types'
import { clinicProfileStore } from '@/stores/modules/clinic.module'
import { useUserStore } from '@/stores/modules/user.module'
import { getErrorMessage, notifications } from '@/services/utils'

const { t } = useI18n()
const { show } = useMenu()

const columns = defineVaDataTableColumns([
  { label: t('dentists.dentist'), key: 'dentistId', sortable: true },
  { label: t('clinics.clinic'), key: 'clinicId', sortable: true },
  { label: t('dentists.degree'), key: 'degree', sortable: true },
  { label: t('dentists.institute'), key: 'institute', sortable: true },
  { label: t('dentists.specialization'), key: 'specialization', sortable: true },
  { label: t('dentists.yearOfExperience'), key: 'yearOfExperience', sortable: true },
  { label: ' ', key: 'actions' },
])

const emit = defineEmits<{
  (event: 'edit', category: Dentist): void
  (event: 'delete', category: Dentist): void
  (event: 'selectedDentist', category: Dentist): void
}>()

const props = defineProps({
  dentist: {
    type: Array as PropType<Dentist[]>,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
})

const contextmenu = (event: any) => {
  event.event.preventDefault()
  show({
    event: event.event,
    options: [
      { text: t('settings.edit'), icon: 'edit' },
      { text: t('settings.delete'), icon: 'delete' },
    ],
    onSelected(option) {
      console.log('selected', option)
      console.log('selected', event.item)
    },
  })
}

const dblclick = (event: any) => {
  emit('selectedDentist', event.item)
}

const selectedItemsEmitted = defineModel('selectedItemsEmitted', {
  type: Array as PropType<Dentist[]>,
  default: [],
})

const handleSelectionChange = (selectedItems: Dentist[]) => {
  selectedItemsEmitted.value = selectedItems
}

const { init: notify } = useToast()

const clinics = ref<Clinic[]>([])
const users = ref<UserDetail[]>([])
const clinicStores = clinicProfileStore()
const userStores = useUserStore()

const getClinics = async () => {
  await clinicStores.getAllClinics()
  clinics.value = clinicStores.clinics
  // console.log('clinics', clinics.value)
}

const dataFilter = ref({
  pageNumber: 0,
  pageSize: 100,
})

const getUsers = async () => {
  userStores
    .getUsers(dataFilter.value)
    .then((response: any) => {
      users.value = response.data
      // console.log('users', users.value)
      // console.log('response', response)
    })
    .catch((error: any) => {
      notify({
        message: notifications.getFailed(t('users.user')) + getErrorMessage(error),
        color: 'error',
      })
    })
}

onMounted(() => {
  getClinics()
  getUsers()
})
</script>
