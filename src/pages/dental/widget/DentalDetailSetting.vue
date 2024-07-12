<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { SettingShowDetail } from '../types'
import { SettingProfile } from '@/pages/user/types.js'
import { SettingProfileOptions } from '@/pages/user/UserProfile.enum.js'
const listSettings = ref<SettingShowDetail[]>([
  {
    id: '1',
    name: 'Appointment',
    icon: '',
  },
  {
    id: '2',
    name: 'Prescription',
    icon: '',
  },
  {
    id: '3',
    name: 'Follow Up Appointment',
    icon: '',
  },
  {
    id: '4',
    name: 'Medical',
    icon: '',
  },
])
const activeOption = ref(SettingProfileOptions.General)
const emit = defineEmits(['select-setting-option'])

function selectSettingOption(item: SettingProfile) {
  emit('select-setting-option', item)
  activeOption.value = item.name
}

const tabs = [
  { id: '1', name: 'Appointment', icon: '' },
  { id: '2', name: 'Prescription', icon: '' },
  { id: '3', name: 'Follow up appointment', icon: '' },
  { id: '4', name: 'Medical', icon: '' },
]

const selectedTab = ref(tabs[0].id)

onMounted(() => {
  selectSettingOption(listSettings.value[0])
})
</script>

<template>
  <VaTabs v-model="selectedTab" vertical grow class="mr-5">
    <template #tabs>
      <VaTab v-for="tab in tabs" :key="tab.id" :name="tab.id" @click="selectSettingOption(tab)">
        <VaIcon :name="tab.icon" class="mr-2" />
        {{ tab.name }}
      </VaTab>
    </template>
  </VaTabs>
</template>
