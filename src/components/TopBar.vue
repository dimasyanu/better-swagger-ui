<script setup lang="ts">
import { onMounted, ref, watch, type Ref } from 'vue'
import { getColorForMethod } from '@/constants/colors.enum'
import IconSwagger from '@/assets/icons/swagger.svg'
import { useGlobalStore } from '@/stores/global.store'
import { isNullOrEmpty } from '@/helpers/helper'
import { useTheme } from 'vuetify'
import { computed } from 'vue'
import type { ApiEndpoint } from '@/models/api-data.model'

const theme = useTheme()
const globalStore = useGlobalStore()
const isDarkMode = ref(false)

const searchAll: Ref<{ input: string | null; placeholder: string }> = ref({
  input: null,
  placeholder: 'Search everything (Min: 3 letters)',
})

const items = computed((): ApiEndpoint[] => {
  let endpoints = globalStore.apiData.flatMap((x) => x.endpoints)
  if (
    isNullOrEmpty(searchAll.value.input) ||
    (searchAll.value.input?.length ?? 0) < 3
  )
    return []
  return endpoints
})

const noDataText = computed((): string => {
  if (
    isNullOrEmpty(searchAll.value.input) ||
    (searchAll.value.input?.length ?? 0) < 3
  )
    return 'Type at least 3 characters.'
  return 'No matching result'
})

watch(isDarkMode, (isDark) => {
  theme.global.name.value = isDark ? 'dark' : 'light'
})

onMounted(() => {
  globalStore.initializeThemeMode()
  isDarkMode.value = globalStore.isDarkMode
})

const changeTheme = function (val: any) {
  globalStore.changeThemeMode(val as boolean)
  isDarkMode.value = globalStore.isDarkMode
}
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
        <v-col
          id="search-input-container"
          class="text-center d-flex align-center px-16"
          cols="12"
          sm="6"
        >
          <!-- <v-text-field
            id="global-search-input"
            :loading="false"
            class="d-sm-inline-block"
            append-inner-icon="mdi-magnify"
            density="compact"
            :label="searchAll.placeholder"
            :placeholder="searchAll.placeholder"
            variant="outlined"
            hide-details
            single-line
            v-model="searchAll.input"
            clearable
            @click:clear="store.clearSearch()"
          ></v-text-field> -->
          <v-autocomplete
            id="global-search-input"
            :loading="false"
            :items="items"
            class="d-sm-inline-block"
            append-inner-icon="mdi-magnify"
            density="compact"
            :label="searchAll.placeholder"
            :placeholder="searchAll.placeholder"
            :no-data-text="noDataText"
            variant="outlined"
            hide-details
            single-line
            menu
            v-model="searchAll.input"
            clearable
            @click:clear="globalStore.clearSearch()"
          >
            <template v-slot:item="{ item }">
              <v-list-item>
                <v-chip
                  class="method mr-3 my-2 text-uppercase"
                  label
                  size="small"
                  variant="flat"
                  :color="
                    getColorForMethod(item.raw.method, globalStore.isDarkMode)
                  "
                >
                  {{ item.raw.method }}
                </v-chip>
                <v-list-item-title class="inline">
                  {{ item.raw.path }}
                </v-list-item-title>
                <v-tooltip
                  v-if="!isNullOrEmpty(item.raw.request.summary)"
                  activator="parent"
                  location="end"
                >
                  {{ item.raw.request.summary }}
                </v-tooltip>
              </v-list-item>
            </template>
          </v-autocomplete>
        </v-col>
        <v-col cols="12" sm="3" class="text-right px-2">
          <div class="float-right d-flex align-center">
            <v-icon
              class="cursor-pointer"
              icon="mdi-white-balance-sunny"
              :color="!isDarkMode ? 'yellow-darken-2' : 'grey-darken-1'"
              @click="changeTheme(!isDarkMode)"
            ></v-icon>
            <v-switch
              class="mx-2"
              color="indigo"
              hide-details
              inset
              :model-value="isDarkMode"
              @click="changeTheme(!isDarkMode)"
            ></v-switch>
            <v-icon
              class="cursor-pointer"
              icon="mdi-weather-night"
              :color="isDarkMode ? 'indigo-lighten-2' : 'grey-darken-1'"
              @click="changeTheme(!isDarkMode)"
            ></v-icon>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>
</template>
