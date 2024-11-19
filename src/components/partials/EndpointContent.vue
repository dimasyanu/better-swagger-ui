<script lang="ts" setup>
import { ApiEndpoint } from '@/models/api-data.model'

defineProps({
  endpoint: ApiEndpoint,
})
</script>
<template>
  <v-card variant="plain" class="bg-surface-light px-6 py-5">
    {{ endpoint?.request.summary }}
  </v-card>
</template>
