<script lang="ts" setup>
import { PropType } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const selectedItems = defineModel('selectedItem', {
  type: Array as PropType<any[]>,
  default: [],
})

const searchTerm = defineModel('searchTerm', {
  type: String,
  default: '',
})

const deleteSelectedUser = () => {
  console.log('deleteSelectedUser', selectedItems.value)
}

const handleSearchChange = (e: any) => {
  searchTerm.value = e.target.value
  console.log('searchTerm', searchTerm.value)
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
              Delete</VaButton
            >
          </div>
          <VaDropdown placement="bottom-end">
            <template #anchor>
              <VaButton icon="filter_alt" />
            </template>
            <VaDropdownContent class="p-0">
              <!-- <VaButton
                preset="secondary"
                size="small"
                style="width: 100%"
                class="p-2"
                :icon="folderPermissionType == 0 ? 'check' : ''"
                @click="folderPermissionType = 0"
                >{{ t('questionFolder.all') }}</VaButton
              > -->
            </VaDropdownContent>
            <VaDropdownContent class="p-0">
              <!-- <VaButton
                preset="secondary"
                size="small"
                style="width: 100%"
                class="p-2"
                :icon="folderPermissionType == 1 ? 'check' : ''"
                @click="folderPermissionType = 1"
                >{{ t('questionFolder.my_documents') }}</VaButton
              > -->
            </VaDropdownContent>
            <VaDropdownContent class="p-0">
              <!-- <VaButton
                preset="secondary"
                size="small"
                style="width: 100%"
                class="p-2"
                :icon="folderPermissionType == 2 ? 'check' : ''"
                @click="folderPermissionType = 2"
                >{{ t('questionFolder.shared_documents') }}</VaButton
              > -->
            </VaDropdownContent>
          </VaDropdown>
        </VaCard>
      </VaCard>
    </VaCard>
    <!-- <VaCardContent class="pb-0">
      <QuestionFolder
        v-model:selectedItemsEmitted="selectedItemsEmitted"
        :question-trees="questionTreesFiltered"
        :loading="loading"
        :total-questions="totalQuestions"
        :current-show-folder-id="currentShowFolderId"
        :mode="props.mode"
        @edit="editQuestionTree"
        @delete="deleteQuestionTreeOne"
        @selectedFolder="selectedFolder"
        @share="shareQuestionTree"
        @viewQuestions="showQuestions"
      />
    </VaCardContent> -->
  </VaCard>
</template>
