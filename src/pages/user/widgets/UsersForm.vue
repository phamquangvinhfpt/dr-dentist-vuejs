<script lang="ts" setup>
import { useUserStore } from '@/stores/modules/user.module'
import { PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import { getErrorMessage, notifications } from '@/services/utils'
import { useToast } from 'vuestic-ui'
const { t } = useI18n()
const UserStore = useUserStore()
const { init: notify } = useToast()
const selectedItems = defineModel('selectedItem', {
  type: Array as PropType<any[]>,
  default: [],
})

const searchTerm = defineModel('searchTerm', {
  type: String,
  default: '',
})

const deleteSelectedUser = () => {
  console.log('deleteSelectedUser', selectedItems.value[0].id)
}

const toggleUserLock = async () => {
  if (selectedItems.value.length > 0) {
    const user = selectedItems.value[0]
    try {
      if (user.isAccountLocked) {
        await UserStore.unlockUserAccount(user.id)
          .then(() => {
            notify({
              message: notifications.updatedSuccessfully(t('user_manager.success_unlocked')),
              color: 'success',
            })
          })
          .catch((error) => {
            notify({
              message: notifications.updateFailed(t('user_manager.success_unlocked')) + getErrorMessage(error),
              color: 'error',
            })
          })
      } else {
        await UserStore.lockUserAccount(user.id)
          .then(() => {
            notify({
              message: notifications.updatedSuccessfully(t('user_manager.success_locked')),
              color: 'success',
            })
          })
          .catch((error) => {
            notify({
              message: notifications.updateFailed(t('user_manager.success_locked')) + getErrorMessage(error),
              color: 'error',
            })
          })
      }
      user.isAccountLocked = !user.isAccountLocked
    } catch (error) {
      notify({
        message: notifications.updateFailed(t('user_manager.user')) + getErrorMessage(error),
        color: 'error',
      })
    }
  }
}

const handleSearchChange = (e: any) => {
  searchTerm.value = e.target.value
}
</script>
<template>
  <VaCard class="pb-0">
    <VaCard class="flex flex-col sm:flex-row gap-2 p-2 mb-2">
      <VaInput
        v-model="searchTerm"
        :placeholder="t('user_manager.search_placeholder')"
        class="flex-grow"
        @input="handleSearchChange"
      >
        <template #appendInner>
          <VaIcon color="secondary" class="material-icons">search</VaIcon>
        </template>
      </VaInput>
      <VaCard class="flex justify-end items-center">
        <VaCard class="flex gap-2">
          <div class="flex flex-row gap-2 justify-end">
            <VaButton v-if="selectedItems.length != 0" icon="delete" color="danger" @click="deleteSelectedUser()">
              {{ t('user_manager.delete') }}</VaButton
            >
            <VaButton
              v-if="selectedItems.length > 0"
              :icon="selectedItems[0].isAccountLocked ? 'lock_open' : 'lock'"
              :color="selectedItems[0].isAccountLocked ? 'success' : 'warning'"
              class="adaptive-button"
              @click="toggleUserLock()"
            >
              {{ selectedItems[0].isAccountLocked ? t('user_manager.unlocked') : t('user_manager.locked') }}
            </VaButton>
          </div>
        </VaCard>
      </VaCard>
    </VaCard>
  </VaCard>
</template>
<style scoped>
.adaptive-button {
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
