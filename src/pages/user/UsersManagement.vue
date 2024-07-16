<template>
  <h1 class="font-bold text-xl">{{ t('menu.usersManagement') }}</h1>
  <VaCard class="my-4 rounded p-5">
    <UsersForm v-model:selectedItem="selectedItems" v-model:searchTerm="dataFilter.searchTerm" />
    <UsersTable v-model:selectedItemsEmitted="selectedItems" :filter-queries="dataFilter" />
  </VaCard>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue'
import { FilterUser, UserDetail } from './types'
import { useI18n } from 'vue-i18n'
import UsersForm from '@/pages/user/widgets/UsersForm.vue'
import UsersTable from '@/pages/user/widgets/UsersTable.vue'

const { t } = useI18n()
const dataFilter = ref<FilterUser>({
  pageNumber: 1,
  pageSize: 10,
  sortBy: 'FullName',
  sortOrder: 'asc',
  searchTerm: '',
  filterBy: '',
  filterValue: '',
})
const selectedItems = ref<UserDetail[]>([])
watch(selectedItems, (newVal) => {
  selectedItems.value = newVal
})
watch(
  () => dataFilter.value.searchTerm,
  (newVal) => {
    dataFilter.value.searchTerm = newVal
  },
)
</script>
