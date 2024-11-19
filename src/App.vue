<script setup lang="ts">
import { onMounted } from 'vue'
import BaseLayout from './components/BaseLayout.vue'
import { useGlobalStore } from './stores/global.store'

const globalStore = useGlobalStore()

onMounted(() => {
  globalStore.initializeThemeMode()
})
</script>

<template>
  <BaseLayout />
</template>
