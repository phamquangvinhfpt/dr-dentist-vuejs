<script lang="ts" setup>
import { useUserStore } from '@/stores/modules/user.module'
import { PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import { getErrorMessage, notifications } from '@/services/utils'
import { useModal, useToast } from 'vuestic-ui'
import { useEventBus } from '@vueuse/core'
import { USER_DELETED_EVENT } from '../types'

const { t } = useI18n()
const { confirm } = useModal()
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

const deleteSelectedUser = async () => {
  const user = selectedItems.value[0]
  const confirmDelete = await confirm({
    title: t('user_manager.delete_user'),
    message: t('user_manager.delete_user_confirm', { name: user.fullName }),
    okText: t('user_manager.delete'),
    cancelText: t('user_manager.cancel'),
    backgroundColor: 'background-secondary',
  })
  if (confirmDelete) {
    try {
      await UserStore.deleteUserAccount(user.id).then((response) => {
        if (response.succeeded) {
          notify({
            message: notifications.deleteSuccessfully(t('user_manager.user')),
            color: 'success',
          })
        } else {
          notify({
            message: notifications.deleteFailed(t('user_manager.user')),
            color: 'error',
          })
        }
      })
      selectedItems.value = selectedItems.value.filter((item) => item.id !== user.id)

      useEventBus(USER_DELETED_EVENT).emit()
    } catch (error) {
      notify({
        message: notifications.deleteFailed(t('user_manager.user')) + getErrorMessage(error),
        color: 'error',
      })
    }
  } else {
    notify({
      message: t('user_manager.delete_cancelled'),
      color: 'info',
    })
  }
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
