<script setup lang="ts">
import { getColorForMethod as getBgColorForMethod } from '@/constants/colors.enum'
import NavigationDrawer from '@/components/NavigationDrawer.vue'
import TopBar from '@/components/TopBar.vue'
import EndpointContent from './partials/EndpointContent.vue'
import { useGlobalStore } from '@/stores/global.store'
import { useTemplateRef, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useSnackbarStore } from '@/stores/snackbar.store'
import type { ApiEndpoint } from '@/models/api-data.model'
import { useScroll } from '@vueuse/core'

const globalStore = useGlobalStore()
const snackbarStore = useSnackbarStore()
const { currentEndpointIndex } = storeToRefs(globalStore)
const copyUrl = (path: string): void => {
  snackbarStore.show('<b>Copied</b>: ' + path)
}
const getPanelClass = (method: string): string => {
  let color = 'info'
  switch (method) {
    case 'post':
      color = 'success'
      break
    case 'put':
      color = 'warning'
      break
    case 'delete':
      color = 'danger'
      break
    default:
      color = 'info'
      break
  }
  return 'border-md border-opacity-50 border-' + color
}

const trySend = (endpoint: ApiEndpoint) => {}
const getHistories = (endpoint: ApiEndpoint) => {}

const main = useTemplateRef<HTMLElement>('main')
const { x, y } = useScroll(main)

watch(currentEndpointIndex, (index) => {
  setTimeout(() => {
    const target = useTemplateRef<HTMLElement | null>('panel-' + index)
    if (!target.value) return
    target.value!.scrollIntoView({ behavior: 'smooth', block: 'start' })
    // goTo('#panel-' + index, { offset: -150 })
  }, 200)
})
</script>

<template>
  <div class="flex flex-row w-full h-full overflow-y-auto bg-base-200">
    <NavigationDrawer />

    <div class="flex flex-col flex-grow">
      <TopBar />

      <main ref="main" class="flex-grow py-5 h-full overflow-y-auto">
        <div class="container flex flex-col gap-2 m-auto">
          <div
            v-for="(endpoint, i) in globalStore.currentEndpoints"
            :key="i"
            :ref="'panel-' + i"
            class="collapse collapse-arrow bg-base-100 border border-base-300"
          >
            <input type="radio" name="my-accordion-2" :checked="currentEndpointIndex == i" />
            <div class="collapse-title font-semibold flex flex-row items-center gap-2">
              <div
                class="badge uppercase"
                :style="{
                  color:
                    'var(' +
                    getBgColorForMethod(endpoint.method, globalStore.isDarkMode) +
                    '-content)',
                  backgroundColor:
                    'var(' + getBgColorForMethod(endpoint.method, globalStore.isDarkMode) + ')',
                }"
              >
                {{ endpoint.method }}
              </div>
              <span>{{ endpoint.path }}</span>
            </div>
            <div class="collapse-content text-sm">
              Click the "Sign Up" button in the top right corner and follow the registration
              process.
            </div>
          </div>
          <!--
        <v-expansion-panels v-model="currentEndpointIndex">
          <v-expansion-panel
            v-for="(endpoint, i) in globalStore.currentEndpoints"
            :class="i === globalStore.currentEndpointIndex ? getPanelClass(endpoint.method) : ''"
            :key="i"
          >
            <v-expansion-panel-title
              :id="'panel-' + i"
              class="px-4 py-1 ms-none"
              :expand-icon="undefined"
              :collapse-icon="undefined"
            >
              <v-chip
                class="method mr-3 my-2 text-uppercase"
                label
                size="small"
                variant="flat"
                :color="getColorForMethod(endpoint.method, globalStore.isDarkMode)"
              >
                {{ endpoint.method }}
              </v-chip>
              <v-icon
                icon="mdi-content-copy"
                class="ml-4 mr-2 icon-hover-shadow"
                @click.stop="copyUrl(endpoint.path)"
              ></v-icon>
              {{ endpoint.path }}
              <v-btn-group density="compact" class="ms-auto">
                <v-btn
                  density="compact"
                  size="small"
                  variant="outlined"
                  @click.stop="trySend(endpoint)"
                  >Try it out</v-btn
                >
                <v-btn
                  class="px-5"
                  density="compact"
                  icon="mdi-history"
                  size="small"
                  variant="outlined"
                  @click.stop="getHistories(endpoint)"
                ></v-btn>
              </v-btn-group>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <endpoint-content :endpoint="endpoint"></endpoint-content>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
 -->
        </div>
      </main>
    </div>

    <div v-if="snackbarStore.active" class="toast">
      <div class="alert alert-info">
        <span>New message arrived.</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.v-app-bar-title {
  .v-toolbar-title__placeholder {
    display: flex;
    align-items: center;
  }
}

.v-expansion-panel-title {
  & > .v-expansion-panel-title__icon {
    margin-inline-start: initial;
  }
}
</style>
