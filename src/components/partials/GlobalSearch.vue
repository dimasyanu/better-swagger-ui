<script setup lang="ts">
import { getColorForMethod } from '@/constants/colors.enum'
import { isNullOrEmpty } from '@/helpers/helper'
import type { ApiEndpoint } from '@/models/api-data.model'
import { useGlobalStore } from '@/stores/global.store'
import { computed } from 'vue'
import { type Ref, ref, watch } from 'vue'

const globalStore = useGlobalStore()

const search: Ref<string | null> = ref(null)
const searchCurrent: Ref<ApiEndpoint | null> = ref(null)
// const searchItems: Ref<ApiEndpoint[]> = ref([])
const searchPlaceholder = 'Search everything (Min: 3 letters)'
const searchFilter: any = (
  value: string,
  query: string | null,
  item?: Ref<ApiEndpoint | null>
) => {
  if (
    item === null ||
    item === undefined ||
    isNullOrEmpty(query) ||
    (query?.length ?? 0) < 3
  )
    return false
  return item.value!.path.toLowerCase().includes(query!)
}

const searchMenuState = computed(() => {
  return true
  // return searchItems.value.length > 0
})

const searchItems = computed((): ApiEndpoint[] => {
  //   if ((searchAll.value.input?.length ?? 0) < 3) return []
  return globalStore.apiData.flatMap((x) => x.endpoints)
  //     .filter((x) => x.path.toLowerCase().includes(searchAll.value.input!))
})

// watch(search, (newVal) => {
//   if ((newVal?.length ?? 0) < 3) searchItems.value = []
//   searchItems.value = globalStore.apiData
//     .flatMap((x) => x.endpoints)
//     .filter((x) => x.path.toLowerCase().includes(newVal!))
// })
</script>

<template>
  <div id="global-search-input" class="w-100 d-sm-inline-block">
    <v-autocomplete
      v-if="true"
      :loading="false"
      :items="searchItems"
      append-inner-icon="mdi-magnify"
      density="compact"
      :label="searchPlaceholder"
      :placeholder="searchPlaceholder"
      variant="outlined"
      single-line
      hide-details
      :custom-filter="searchFilter"
      v-model="searchCurrent"
      clearable
      @update:search="search = $event"
      @click:clear="globalStore.clearSearch()"
    >
      <template v-slot:item="{ item }">
        <v-list-item>
          <v-chip
            class="method mr-3 my-2 text-uppercase"
            label
            size="small"
            variant="flat"
            :color="getColorForMethod(item.raw.method, globalStore.isDarkMode)"
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
  </div>
</template>
