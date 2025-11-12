<script setup lang="ts">
import { MethodColor } from '@/constants/colors.enum'
import NavigationDrawer from '@/components/NavigationDrawer.vue'
import TopBar from '@/components/TopBar.vue'
import EndpointContent from './partials/EndpointContent.vue'
import { useGlobalStore } from '@/stores/global.store'
import { watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useSnackbarStore } from '@/stores/snackbar.store'
import type { ApiEndpoint } from '@/models/api-data.model'
import CopyIcon from './icons/CopyIcon.vue'
import TimeIcon from './icons/TimeIcon.vue'

const globalStore = useGlobalStore()
const snackbarStore = useSnackbarStore()
const { currentEndpointIndex } = storeToRefs(globalStore)
const copyUrl = (event: MouseEvent, path: string): void => {
  event.stopPropagation()
  snackbarStore.info('<b>Copied</b>: ' + path)
}
const trySend = (e: MouseEvent, endpoint: ApiEndpoint) => {
  e.stopPropagation()
}
const getHistories = (e: MouseEvent, endpoint: ApiEndpoint) => {
  e.stopPropagation()
}

const selectEndpoint = (index: number) => {
  if (index === currentEndpointIndex.value) {
    currentEndpointIndex.value = null
    return
  }
  currentEndpointIndex.value = index
}

watch(currentEndpointIndex, (index) => {
  const target = <HTMLElement | null>document.getElementById('panel-' + index)
  if (!target) return
  target.scrollIntoView({ behavior: 'smooth', block: 'start' })
})
</script>

<template>
  <div class="flex flex-row w-full h-full overflow-y-auto bg-base-200">
    <NavigationDrawer />

    <div class="flex flex-col flex-grow relative z-1">
      <TopBar />

      <main ref="main" class="flex-grow py-5 h-full overflow-y-auto relative z-0">
        <div class="container flex flex-col gap-2 m-auto">
          <div
            v-for="(endpoint, i) in globalStore.currentEndpoints"
            :key="i"
            :id="'panel-' + i"
            class="collapse collapse-arrow bg-base-100 border border-base-300"
          >
            <input
              type="radio"
              name="endpoint"
              class="z-0"
              :checked="currentEndpointIndex == i"
              :value="i"
            />
            <div
              class="collapse-title font-semibold flex flex-row items-center gap-2 z-1 p-0"
              @click="selectEndpoint(i)"
            >
              <div class="p-4 flex flex-row items-center gap-2 flex-grow">
                <div
                  class="badge uppercase min-w-[74px]"
                  :style="{
                  color:
                    'var(' +
                    MethodColor[endpoint.method as string] +
                    '-content)',
                  backgroundColor:
                    'var(' + MethodColor[endpoint.method as string] + ')',
                }"
                >
                  {{ endpoint.method }}
                </div>
                <div
                  class="btn btn-xs btn-circle bg-transparent border-none cursor-pointer"
                  @click="copyUrl($event, endpoint.path)"
                >
                  <CopyIcon />
                </div>
                <span>{{ endpoint.path }}</span>
              </div>
              <div class="pr-12">
                <div class="btn btn-md rounded-r-none" @click="trySend($event, endpoint)">
                  Try it
                </div>
                <div class="btn px-2 rounded-l-none" @click="getHistories($event, endpoint)">
                  <TimeIcon />
                </div>
              </div>
            </div>
            <div class="collapse-content text-sm">
              <EndpointContent :endpoint="endpoint" />
            </div>
          </div>
        </div>
      </main>
    </div>

    <div v-if="snackbarStore.notifications.length > 0" class="toast z-999">
      <div v-for="n in snackbarStore.notifications" class="alert" :class="'alert-' + n.type">
        <span v-html="n.message"></span>
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
