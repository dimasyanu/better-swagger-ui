<script setup>
import { isNullOrEmpty } from '@/helpers/helper'
import { SwaggerRoot } from '@/models/swagger-root.model'
import { onMounted, ref } from 'vue'

const navDrawerFilters = ref({
  input: '',
  placeholder: 'Search',
})

onMounted(async () => {
  var swaggerJsonPath = localStorage.getItem('swagger_json_path')
  if (isNullOrEmpty(swaggerJsonPath)) {
    swaggerJsonPath = import.meta.env.VITE_SWAGGER_DEFAULT_PATH
  }

  var response = await fetch(swaggerJsonPath)
  console.log(SwaggerRoot(await response.json()))
})
</script>

<template>
  <v-navigation-drawer>
    <v-list-item class="pt-3 pb-2">
      <v-text-field
        id="search-input"
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
