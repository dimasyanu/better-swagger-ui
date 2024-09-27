<script setup lang="ts">
import { getColorForMethod } from '@/constants/colors.enum';
import NavigationDrawer from '@/components/NavigationDrawer.vue'
import TopBar from '@/components/TopBar.vue';
import { useGlobalStore } from '@/stores/global.store';
import { ref } from 'vue';
import { watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useGoTo } from 'vuetify';

const goTo = useGoTo()
const globalStore = useGlobalStore()
const { currentEndpointIndex } = storeToRefs(globalStore)
const snackbar = ref({
  text: "",
  state: false
})
const copyUrl = (path: string): void => {
  snackbar.value.text = '<b>Copied</b>: ' + path
  snackbar.value.state = true
}
const getPanelClass = (method: string): string => {
  let color = 'info'
  switch (method) {
    case 'post': color = 'success'; break;
    case 'put': color = 'warning'; break;
    case 'delete': color = 'danger'; break;
    default: color = 'info'; break;
  }
  return 'border-md border-opacity-50 border-' + color
}

watch(currentEndpointIndex, (index) => {
  setTimeout(() => {
    goTo('#panel-' + index, { offset: -150 })
  }, 200);
})
</script>

<template>
  <v-app id="inspire">
    <navigation-drawer></navigation-drawer>

    <top-bar></top-bar>

    <v-main>
      <v-container>
        <v-expansion-panels v-model="currentEndpointIndex">
          <v-expansion-panel v-for="(endpoint, i) in globalStore.currentEndpoints"
            :class="i === globalStore.currentEndpointIndex ? getPanelClass(endpoint.method) : ''" :key="i">
            <v-expansion-panel-title :id="'panel-' + i" class="px-4 py-1">
              <v-chip class="method mr-3 my-2 text-uppercase" label size="small" variant="flat"
                :color="getColorForMethod(endpoint.method, globalStore.isDarkMode)">
                {{ endpoint.method }}
              </v-chip>
              <v-icon icon="mdi-content-copy" class="ml-4 mr-2 icon-hover-shadow"
                @click.stop="copyUrl(endpoint.path)"></v-icon>
              {{ endpoint.path }}
            </v-expansion-panel-title>
            <v-expansion-panel-text>Lorem ipsum dolor</v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-container>
    </v-main>

    <v-snackbar v-model="snackbar.state" :timeout="2000">
      <span v-html="snackbar.text"></span>
      <template v-slot:actions>
        <v-btn color="#fff" variant="text" @click="snackbar.state = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<style lang="scss">
.v-app-bar-title {
  .v-toolbar-title__placeholder {
    display: flex;
    align-items: center;
  }
}
</style>
