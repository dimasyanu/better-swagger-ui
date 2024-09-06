<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import IconSwagger from '@/assets/icons/swagger.svg'
import { useGlobalStore } from '@/stores/global.store';
import { useTheme } from 'vuetify';

const theme = useTheme()
const store = useGlobalStore()
const isDarkMode = ref(false)

const searchAll = ref({
  input: '',
  placeholder: 'Search everything',
})

watch(isDarkMode, isDark => {
  theme.global.name.value = isDark ? 'dark' : 'light'
})

onMounted(() => {
  store.initializeThemeMode()
  isDarkMode.value = store.isDarkMode
})

const changeTheme = function(val: any) {
  console.log(val)
  store.changeThemeMode(val as boolean)
  isDarkMode.value = store.isDarkMode
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
          <v-text-field
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
          ></v-text-field>
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
