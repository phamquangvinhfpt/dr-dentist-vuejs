<template>
  <VaDataTable
    class="my-table va-table--hoverable"
    :items="users"
    :columns="columns"
    hoverable
    clickable
    selectable
    select-mode="single"
    :disable-client-side-sorting="false"
    :style="{
      '--va-data-table-thead-background': 'var(--va-background-element)',
      '--va-data-table-grid-tr-border': '1px solid var(--va-background-border)',
    }"
    sticky-header
    no-data-html="<div class='text-center'>No data found</div>"
    @selectionChange="handleSelectionChange($event.currentSelectedItems)"
  >
    <template #cell(user)="{ row }">
      <div class="ellipsis max-w-[230px] lg:max-w-[450px]">
        <span class="flex gap-2">
          <VaAvatar
            :src="getSrcAvatar(row)"
            class="w-14 h-14 bg-warning font-bold"
            :fallback-text="row.rowData?.fullName?.charAt(0)?.toUpperCase()"
          />
          <div>
            <p class="text-sm">{{ row.rowData?.fullName }}</p>
            <p class="text-secondary">{{ row.rowData?.email }}</p>
          </div>
        </span>
      </div>
    </template>
    <template #cell(gender)="{ row }">
      <div class="flex items-center gap-2 ellipsis max-w-[230px]">
        <span class="w-24">{{ row.rowData?.gender === 1 ? t('user_manager.male') : t('user_manager.female') }}</span>
      </div>
    </template>
    <template #cell(birthDate)="{ row }">
      <div class="flex items-center gap-2 ellipsis max-w-[230px]">
        <span class="w-24">{{ formatBirthDate(row.rowData?.birthDate) }}</span>
      </div>
    </template>
    <template #cell(role)="{ row }">
      <div class="flex items-center gap-2 ellipsis max-w-[150px]">
        <VaSelect
          :model-value="getRoleOption(row.rowData.roleType)"
          track-by="roleType"
          :text-by="(option: any) => option.name"
          :options="RoleTypeOptions"
          @update:modelValue="updateUserRole(row.rowData?.roleType, $event)"
        >
          <template #content="{ value }">
            <VaBadge :text="value.name" :color="RoleTypeColor(value.roleType)" class="mr-2" />
          </template>
          <template #option="{ option, selectOption }">
            <button class="w-full flex items-center" @click="() => selectOption(option)">
              <div class="flex justify-between items-center p-2">
                <VaBadge :text="(option as any).name" :color="RoleTypeColor((option as any).roleType)" class="mr-2" />
              </div>
            </button>
          </template>
        </VaSelect>
      </div>
    </template>
    <template #cell(lock)="{ row }">
      <div class="flex items-center gap-2 ellipsis max-w-[230px]">
        <VaBadge
          :text="row.rowData?.isAccountLocked ? t('user_manager.locked') : t('user_manager.unlocked')"
          :color="LockTypeColor(row.rowData?.isAccountLocked)"
          class="mr-2"
        />
      </div>
    </template>
    <template #cell(phoneNumber)="{ value }">
      <div class="flex items-center gap-2 ellipsis max-w-[230px]">
        <VaPopover icon="info" :message="formatPhoneNumber(value)">
          <div>{{ value }}</div>
        </VaPopover>
      </div>
    </template>
  </VaDataTable>
  <VaCardContent>
    <div class="flex flex-col-reverse md:flex-row gap-2 justify-between items-center p-2">
      <div>
        <b>{{ pagination.totalRecords }} {{ t('user_manager.results') }}.</b>
        {{ t('user_manager.results_per_page') }}
        <VaSelect v-model="pagination.pageSize" class="!w-20" :options="[10, 50, 100]" />
      </div>
      <div v-if="totalPages > 1" class="flex">
        <VaPagination
          v-model="pagination.pageNumber"
          buttons-preset="secondary"
          :pages="totalPages"
          :visible-pages="5"
          :boundary-links="true"
          :direction-links="true"
        />
      </div>
    </div>
  </VaCardContent>
</template>

<script setup lang="ts">
import { computed, onMounted, PropType, ref } from 'vue'
import { PagingUser, Roles, UserDetail } from '@/pages/user/types'
import { useUserStore } from '@/stores/modules/user.module'
import { getErrorMessage, notifications } from '@/services/utils'
import { useToast } from 'vuestic-ui'
import { watchDebounced } from '@vueuse/core'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const UserStore = useUserStore()
const { init: notify } = useToast()
const totalPages = computed(() => Math.ceil(pagination.value.totalRecords / pagination.value.pageSize))
const users = ref<UserDetail[]>([])
const props = defineProps<{
  filterQueries: any
}>()

const pagination = ref<PagingUser>({
  pageNumber: 1,
  pageSize: 5,
  totalPages: 1,
  currentPage: '',
  totalRecords: 5,
})

const columns = computed(() => [
  { key: 'user', label: t('user_manager.user') },
  { key: 'gender', label: t('user_manager.gender') },
  { key: 'birthDate', label: t('user_manager.birth_date') },
  { key: 'role', label: t('user_manager.role') },
  { key: 'lock', label: t('user_manager.locked') },
  { key: 'phoneNumber', label: t('user_manager.phone_number') },
])

const LockTypeColor = (isAccountLocked: boolean) => {
  return isAccountLocked ? 'danger' : 'success'
}

const RoleTypeOptions = [
  { id: 1, name: t('user_manager.clinic_owner'), roleType: 1 },
  { id: 2, name: t('user_manager.dentist'), roleType: 2 },
  { id: 3, name: t('user_manager.customer'), roleType: 3 },
]

const enum RoleType {
  ClinicOwner = 1,
  Dentist = 2,
  Customer = 3,
}

const RoleTypeColor = (type: RoleType | undefined) => {
  if (!type) return 'primary'
  const colors = [
    {
      type: RoleType.ClinicOwner,
      color: '#FFD43A',
    },
    {
      type: RoleType.Dentist,
      color: '#ADFF00',
    },
    {
      type: RoleType.Customer,
      color: '#262824',
    },
  ]
  const color = colors.find((c) => c.type === type)?.color
  return color || 'primary'
}

const getRoleOption = (roleType: number) => {
  return RoleTypeOptions.find((option) => option.roleType === roleType) || RoleTypeOptions[0]
}

const selectedItemsEmitted = defineModel('selectedItemsEmitted', {
  type: Object as PropType<UserDetail>,
  default: () => ({}),
})

const handleSelectionChange = (selectedItems: UserDetail) => {
  selectedItemsEmitted.value = selectedItems
}

const formatPhoneNumber = (phoneNumber: string) => {
  if (!phoneNumber) return ''
  const cleaned = ('' + phoneNumber).replace(/\D/g, '')
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3]
  }
  return phoneNumber
}

const formatBirthDate = (date: string) => {
  if (!date) return ''
  const birthDate = new Date(date)
  return `${birthDate.getDate().toString().padStart(2, '0')}-${(birthDate.getMonth() + 1).toString().padStart(2, '0')}-${birthDate.getFullYear()}`
}

const getSrcAvatar = (row: any) => {
  const img = row.rowData?.imageUrl
  const url = import.meta.env.VITE_APP_BASE_URL as string
  const url_without_api = url.slice(0, -3)
  if (img) return `${url_without_api}${img}`
  return ''
}

const getUsers = async (query: any) => {
  await UserStore.getUsers(query)
    .then((res) => {
      users.value = UserStore.userDetails
      pagination.value = {
        pageNumber: res.pageNumber,
        pageSize: res.pageSize,
        totalPages: res.totalPages,
        currentPage: res.currentPage,
        totalRecords: res.totalRecords,
        previousPage: res.previousPage || null,
        nextPage: res.nextPage || null,
      }
    })
    .catch((error) => {
      notify({
        message: notifications.getFailed('user') + getErrorMessage(error),
        color: 'error',
      })
    })
}

const updateUserRole = async (currentRoleType: Roles, newRoleOption: { roleType: number; name: string }) => {
  try {
    const userToUpdate = users.value.find((user) => user.roleType === currentRoleType)
    if (userToUpdate) {
      await UserStore.updateUserRole(userToUpdate.id, newRoleOption.roleType)
        .then(() => {
          notify({
            message: notifications.updatedSuccessfully('role'),
            color: 'info',
          })
          userToUpdate.roleType = newRoleOption.roleType
          getUsers({
            pageNumber: pagination.value.pageNumber,
            pageSize: pagination.value.pageSize,
          })
        })
        .catch((error) => {
          notify({
            message: notifications.updateFailed('role') + getErrorMessage(error),
            color: 'error',
          })
        })
    } else {
      notify({
        message: notifications.updateFailed('user'),
        color: 'error',
      })
    }
  } catch (error) {
    notify({
      message: notifications.updateFailed('user') + getErrorMessage(error),
      color: 'error',
    })
  }
}

watchDebounced(
  () => props.filterQueries,
  (newFilterQueries) => {
    const queries = {
      pageNumber: pagination.value.pageNumber,
      pageSize: pagination.value.pageSize,
      ...newFilterQueries,
    }
    getUsers(queries)
  },
  { debounce: 500, maxWait: 1000 },
)

watchDebounced(
  () => pagination.value.pageNumber,
  () => {
    const queries = {
      pageNumber: pagination.value.pageNumber,
      pageSize: pagination.value.pageSize,
    }
    getUsers(queries)
  },
  { debounce: 500, maxWait: 1000, immediate: true },
)

watchDebounced(
  () => pagination.value.pageSize,
  () => {
    const queries = {
      pageNumber: 1,
      pageSize: pagination.value.pageSize,
    }
    getUsers(queries)
  },
  { debounce: 500, maxWait: 1000, immediate: true },
)

watchDebounced(
  () => props.filterQueries.searchTerm,
  (newVal) => {
    const queries = {
      pageNumber: 1,
      pageSize: pagination.value.pageSize,
      searchTerm: newVal,
    }
    getUsers(queries)
  },
  { immediate: true },
)

onMounted(() => {
  const queries = {
    pageNumber: pagination.value.currentPage,
    pageSize: pagination.value.pageSize,
    ...props.filterQueries,
  }
  getUsers(queries)
})
</script>
<style lang="scss" scoped>
.va-data-table {
  ::v-deep(tbody .va-data-table__table-tr) {
    border-bottom: 1px solid var(--va-background-border);
  }
}
</style>
