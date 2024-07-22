<template>
  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 justify-end">
        <VaCard class="flex justify-start items-center flex-grow">
          <VaCard class="flex flex-grow">
            <VaInput :placeholder="t('dentists.search_dentist_name')" class="flex-grow">
              <template #appendInner>
                <VaIcon color="secondary" class="material-icons">search</VaIcon>
              </template>
            </VaInput>
          </VaCard>
        </VaCard>
        <VaButton v-if="selectedItemsEmitted.length != 0" icon="delete" color="danger" @click="deleteSelectedDentist()">
          {{ $t('settings.delete') }}
        </VaButton>
        <VaButton icon="add" @click="createNewDentist()">{{ t('dentists.dentist') }}</VaButton>
      </div>
      <DentistTable
        v-model:selectedItemsEmitted="selectedItemsEmitted"
        :loading="loading"
        :dentist="dentists"
        @edit="editDentist"
        @delete="deleteDentistWithConfirm"
      />
    </VaCardContent>
  </VaCard>
  <VaModal
    v-slot="{ cancel, ok }"
    v-model="doShowDentistFormModal"
    size="small"
    stateful
    close-button
    mobile-fullscreen
    hide-default-actions
    :before-cancel="beforeEditFormModalClose"
    @close="doShowDentistFormModal = false"
  >
    <VaModalHeader>
      <h3 class="text-lg font-bold">
        {{ dentistToEdit ? t('settings.edit') : t('settings.create') }} {{ t('dentists.dentist') }}
      </h3>
    </VaModalHeader>
    <DentistForm
      ref="editFormRef"
      :dentist="dentistToEdit"
      :save-button-label="dentistToEdit === null ? t('settings.add') : t('settings.save')"
      @close="cancel"
      @save="
        (dentist: Dentist) => {
          onDentistSaved(dentist)
          ok()
        }
      "
    />
  </VaModal>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useModal, useToast, VaModal } from 'vuestic-ui'
import { getErrorMessage, notifications } from '@/services/utils'
import { useI18n } from 'vue-i18n'
import { useDentistStore } from '@/stores/modules/dentist.module'
import { Dentist, EmptyDentist } from './types'
import DentistTable from './widget/DentistTable.vue'
import DentistForm from './widget/DentistForm.vue'

const { t } = useI18n()
const loading = ref(true)
const selectedItemsEmitted = ref<Dentist[]>([])
const { init: notify } = useToast()
const editFormRef = ref()
const { confirm } = useModal()
const doShowDentistFormModal = ref(false)
const dentistStores = useDentistStore()
const dentists = ref<Dentist[]>([])
const dentistToEdit = ref<Dentist | null>(null)

const getDentists = () => {
  loading.value = true
  dentistStores
    .getDentists()
    .then((response) => {
      dentists.value = response
    })
    .catch((error) => {
      notify({
        message: notifications.getFailed(t('dentists.dentist')) + getErrorMessage(error),
        color: 'error',
      })
    })
    .finally(() => {
      loading.value = false
    })
}

const isShowModal = ref(false)

const createNewDentist = () => {
  isShowModal.value = true
  dentistToEdit.value = null
  doShowDentistFormModal.value = true
}

const editDentist = (dentist: Dentist) => {
  isShowModal.value = false
  dentistToEdit.value = dentist
  doShowDentistFormModal.value = true
}

const onDentistSaved = async (dentist: Dentist) => {
  doShowDentistFormModal.value = false
  if (!isShowModal.value) {
    dentistStores
      .updateDentist(dentist.dentistId, dentist as EmptyDentist)
      .then(() => {
        notify({
          message: notifications.updatedSuccessfully('dentist'),
          color: 'success',
        })
        getDentists()
      })
      .catch((error) => {
        notify({
          message: notifications.updateFailed('dentist') + getErrorMessage(error),
          color: 'error',
        })
      })
  } else {
    dentistStores
      .createDentist(dentist as EmptyDentist)
      .then(() => {
        notify({
          message: notifications.createSuccessfully('dentist'),
          color: 'success',
        })
        getDentists()
      })
      .catch((error) => {
        notify({
          message: notifications.createFailed('dentist') + getErrorMessage(error),
          color: 'error',
        })
      })
  }
}

const deleteDentist = (dentist: Dentist) => {
  dentistStores
    .deleteDentist(dentist.dentistId)
    .then(() => {
      notify({
        message: notifications.deleteSuccessfully('dentist'),
        color: 'success',
      })
      getDentists()
    })
    .catch((error) => {
      notify({
        message: notifications.deleteFailed('dentist') + getErrorMessage(error),
        color: 'error',
      })
    })
}

const deleteSelectedDentist = () => {
  confirm({
    title: t('dentists.delete_dentist'),
    message: notifications.confirmDelete(`${selectedItemsEmitted.value.length} dentists`),
  }).then((agreed) => {
    if (!agreed) {
      return
    }
    selectedItemsEmitted.value.forEach((dentist) => {
      deleteDentist(dentist)
    })
  })
}

const deleteDentistWithConfirm = (dentist: Dentist) => {
  confirm({
    title: t('dentists.delete_dentist'),
    message: notifications.confirmDelete('dentist'),
  }).then((agreed) => {
    if (!agreed) {
      return
    }
    deleteDentist(dentist)
  })
}

const beforeEditFormModalClose = async (hide: () => unknown) => {
  if (editFormRef.value.isFormHasUnsavedChanges) {
    const agreed = await confirm({
      maxWidth: '380px',
      message: notifications.unsavedChanges,
      size: 'small',
    })
    if (agreed) {
      hide()
    }
  } else {
    hide()
  }
}

onMounted(() => {
  getDentists()
})
</script>
