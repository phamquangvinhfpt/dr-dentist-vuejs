<script lang="ts" setup>
import { computed } from 'vue'
import { useAuthStore } from '@modules/auth.module'

const authStore = useAuthStore()
const isTeacher = computed(() => authStore?.musHaveRole('Admin')) // just for testing
const isStudent = computed(() => authStore?.musHaveRole('Basic')) // just for testing
</script>

<template>
  <h1 class="page-title font-bold">Dashboard</h1>

  <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
    <VaScrollContainer class="max-h-52" vertical>
      >
      <VaCard v-if="isTeacher" title="Teacher" description="Teacher description" />
      <VaCard v-if="isStudent" title="Student" description="Student description" />
    </VaScrollContainer>
  </div>
</template>
