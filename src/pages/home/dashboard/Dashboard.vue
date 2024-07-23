<script lang="ts" setup>
import { computed } from 'vue'
import { useAuthStore } from '@modules/auth.module'
import Admin from './widgets/Admin.vue'
import Customer from './widgets/Customer.vue'

const authStore = useAuthStore()
const isAdmin = computed(() => authStore?.musHaveRole('SuperAdmin'))
const isCustomer = computed(() => authStore?.musHaveRole('Customer'))
</script>

<template>
  <div class="md:mx-28">
    <Admin v-if="isAdmin" />
    <Customer v-if="isCustomer" />
  </div>
</template>
