<script setup lang="ts">
import type { SwaggerRoot } from '@/models/swagger-root.model'
import api from '@/plugins/api'
import { onMounted, ref } from 'vue'

const navDrawerFilters = ref({
  input: '',
  placeholder: 'Search',
})

onMounted(async () => {
  await api
    .getJson()
    .then((res) => storeResponse(res))
    .catch((err) => {})
    .finally(() => {})
})

// Todo: store the response data
const storeResponse = function (root: SwaggerRoot) {}
</script>

<template>
  <v-navigation-drawer>
    <v-list-item class="pt-3 pb-2">
      <v-text-field
        id="group-search-input"
        :loading="false"
        class="d-sm-inline-block w-100"
        append-inner-icon="mdi-magnify"
        density="compact"
        label="Search"
        placeholder="Search"
        variant="outlined"
        hide-details
        single-line
        v-model="navDrawerFilters.input"
      ></v-text-field>
    </v-list-item>

    <v-divider></v-divider>

    <v-list-item class="text-grey text-center"> No endpoints </v-list-item>
  </v-navigation-drawer>
</template>
