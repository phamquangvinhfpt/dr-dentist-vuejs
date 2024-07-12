<template>
  <div class="flex flex-col sm:flex-row">
    <div class="item">
      <VaCard class="p-2 ml-1 mb-5 rounded">
        <DentalDetailSetting @selectSettingOption="handleSelectedSettingOption" />
      </VaCard>
    </div>
    <div class="item w-full">
      <CreateDental :setting-option="selectedSettingOption" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import DentalDetailSetting from './DentalDetailSetting.vue'
import CreateDental from './CreateDental.vue'
import { ref } from 'vue'
import { SettingShowDetail } from '../types'
import { useI18n } from 'vue-i18n'
import { VaCard } from 'vuestic-ui/web-components'

const { t } = useI18n()
const selectedSettingOption = ref<SettingShowDetail | null>({
  id: '1',
  name: t('settings.general'),
  icon: '',
})
function handleSelectedSettingOption(item: SettingShowDetail) {
  selectedSettingOption.value = item
}
</script>
