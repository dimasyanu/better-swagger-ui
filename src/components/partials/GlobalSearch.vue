<script setup lang="ts">
import { getColorForMethod } from '@/constants/colors.enum'
import { isNullOrEmpty } from '@/helpers/helper'
import type { ApiEndpoint } from '@/models/api-data.model'
import { useGlobalStore } from '@/stores/global.store'
import { computed, onMounted } from 'vue'
import { type Ref, ref } from 'vue'

const globalStore = useGlobalStore()
const globalSearchInput: Ref<HTMLInputElement | null> = ref(null)
const items = computed(() => globalStore.apiData.flatMap((x) => x.endpoints))
const search: Ref<string | undefined> = ref(undefined)
const searchFinal: Ref<string | undefined> = ref(undefined)
const searchMinChars = 2
const searchPlaceholder = 'Search endpoints (Min: ' + searchMinChars + ' letters)'
const searchMenuState = ref(false)
const searchFilter: any = (value: string, query: string | null, item?: Ref<ApiEndpoint | null>) => {
  if (
    item === null ||
    item === undefined ||
    isNullOrEmpty(query) ||
    (query?.length ?? 0) < searchMinChars
  )
    return false
  return item.value!.path.toLowerCase().includes(query!)
}

const searchItems = ref(items)
// const searchItems = computed((): ApiEndpoint[] => {
//   if ((search.value?.length ?? 0) < searchMinChars) return []
//   if ((searchFinal.value?.length ?? 0) > searchMinChars) {
//     items.value.filter((x) => x.path.toLocaleLowerCase().includes(searchFinal.value!.toLowerCase()))
//   }
//   return items.value
// })

const doSearch = (query: string) => {
  if (isNullOrEmpty(query)) {
    search.value = undefined
    return
  }
  if (search.value === query || (query.length ?? 0) < 2) return
  search.value = query
  searchItems.value = items.value.filter((x) =>
    x.path.toLocaleLowerCase().includes(query.toLowerCase())
  )
}

const selected = (e: ApiEndpoint) => {
  var tag = e.request.tags[0]
  globalStore.selectEndpointByPath(tag, e.path)
  searchMenuState.value = false
  searchFinal.value = search.value
}

const searchCleared = () => {
  search.value = undefined
  searchFinal.value = undefined
}

const onKeyDown = (event: KeyboardEvent) => {
  if (event.key !== '/' || !event.ctrlKey) return
  globalSearchInput.value?.focus()
  searchMenuState.value = true
}

onMounted(() => {
  document.addEventListener('keydown', onKeyDown)
})
</script>

<template>
  <v-autocomplete
    id="global-search-input"
    ref="globalSearchInput"
    class="d-sm-inline-block"
    append-inner-icon="mdi-magnify"
    menu-icon=""
    v-model:menu="searchMenuState"
    v-model:model-value="search"
    v-model:search="search"
    density="compact"
    variant="outlined"
    :loading="false"
    :items="searchItems"
    :placeholder="searchPlaceholder"
    :custom-filter="searchFilter"
    single-line
    clearable
    hide-details
    hide-no-data
    hide-spin-buttons
    @update:search="doSearch($event)"
    @click:clear="searchCleared()"
  >
    <template v-slot:item="{ item }">
      <v-list-item link @click="selected(item.raw)">
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
      </v-list-item>
    </template>
  </v-autocomplete>
</template>
