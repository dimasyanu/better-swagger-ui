<script setup lang="ts">
import { ref } from 'vue'
import IconSwagger from '@/assets/icons/swagger.svg'
const searchAll = ref({
  input: '',
  width: '50',
  placeholder: 'Search everything',
})
</script>

<template>
  <v-app-bar>
    <v-container class="mx-4" max-width="100%">
      <v-row no-gutters>
        <v-col
          id="app-title-container"
          class="d-flex align-center"
          cols="12"
          sm="3"
        >
          <v-app-bar-title>
            <v-img
              class="d-sm-inline-block w-100 mr-2"
              :src="IconSwagger"
              max-width="42px"
            ></v-img>
            Better Swagger UI
          </v-app-bar-title>
        </v-col>
        <v-col id="search-input-container" class="text-center" cols="12" sm="6">
          <v-text-field
            id="global-search-input"
            :loading="false"
            class="d-sm-inline-block"
            :class="'w-' + searchAll.width"
            append-inner-icon="mdi-magnify"
            density="compact"
            :label="searchAll.placeholder"
            :placeholder="searchAll.placeholder"
            variant="outlined"
            hide-details
            single-line
            @update:focused="
              searchAll.width = $event || searchAll.input != '' ? '100' : '50'
            "
            v-model="searchAll.input"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>
</template>
