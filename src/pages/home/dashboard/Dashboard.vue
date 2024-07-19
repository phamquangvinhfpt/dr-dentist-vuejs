<script lang="ts" setup>
import { computed } from 'vue'
import { useAuthStore } from '@modules/auth.module'
import Admin from './widgets/Admin.vue'
const authStore = useAuthStore()
const isAdmin = computed(() => authStore?.musHaveRole('SuperAdmin'))
</script>

<template>
  <div class="md:mx-28">
    <Admin v-if="isAdmin" />
  </div>
</template>
