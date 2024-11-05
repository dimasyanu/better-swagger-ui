<script setup lang="ts">
import { onMounted, ref, watch, type Ref } from 'vue'
import GlobalSearch from '@/components/partials/GlobalSearch.vue'
import IconSwagger from '@/assets/icons/swagger.svg'
import SourceModal from './partials/SourceModal.vue'
import { useGlobalStore } from '@/stores/global.store'
import { useTheme } from 'vuetify'

const theme = useTheme()
const globalStore = useGlobalStore()
const isDarkMode = ref(false)
const sourceModalState = ref(true)

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
        <!-- Logo/Title -->
        <v-col id="app-title-container" class="d-flex align-center" cols="12" sm="3">
          <v-app-bar-title>
            <v-img class="d-sm-inline-block w-100 mr-2" :src="IconSwagger" max-width="42px"></v-img>
            Better Swagger UI
          </v-app-bar-title>
        </v-col>

        <!-- Source -->
        <v-col id="app-source-container" class="d-flex align-center" cols="12" sm="3">
          <v-btn
            variant="outlined"
            class="text-none"
            title="xmobile.yanoo.mi"
            @click="sourceModalState = true"
          >
            Source: xmobile.yanoo.mi
          </v-btn>
        </v-col>

        <!-- Global search -->
        <v-col id="search-input-container" class="text-center d-flex align-center" cols="12" sm="4">
          <global-search></global-search>
        </v-col>

        <!-- Theme mode -->
        <v-col cols="12" sm="2" class="text-right px-2">
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
    <source-modal v-model="sourceModalState"></source-modal>
  </v-app-bar>
</template>
