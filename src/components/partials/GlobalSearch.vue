<script setup lang="ts">
import type { ApiMethodType } from '@/constants/api-method.enum'
import { MethodColor } from '@/constants/colors.enum'
import { isNullOrEmpty } from '@/helpers/helper'
import type { ApiEndpoint } from '@/models/api-data.model'
import { useGlobalStore } from '@/stores/global.store'
import { computed, onMounted } from 'vue'
import { type Ref, ref } from 'vue'

type SearchItem = {
  data: ApiEndpoint
  html: string
}

const searchMinChars = 2
const searchPlaceholder = 'Search endpoints ..'

const globalStore = useGlobalStore()
const globalSearchInput: Ref<HTMLInputElement | null> = ref(null)
const items = computed(() => globalStore.apiData.flatMap((x) => x.endpoints))

const keyword = ref('')

const filteredEndpoints = computed(() => {
  if (isNullOrEmpty(keyword.value) || keyword.value.length < searchMinChars) return []

  let _keyword = keyword.value
  let endpoints = items.value

  let regex: RegExp
  try {
    regex = new RegExp(_keyword, 'i')
  } catch {
    const escaped = _keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    regex = new RegExp(escaped, 'i')
  }

  endpoints = endpoints.filter((x) => regex.test(x.path))
  return endpoints.map<SearchItem>((x) => ({
    data: x,
    html: x.path.replace(regex, (match) => `<span class="highlight">${match}</span>`),
  }))
})

const searchMenuState = ref(false)

const selected = (e: ApiEndpoint) => {
  var tag = e.request.tags[0]
  if (!tag) tag = 'default'
  globalStore.selectEndpointByPath(tag, e.path)
  searchMenuState.value = false
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
  <label class="input">
    <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <g
        stroke-linejoin="round"
        stroke-linecap="round"
        stroke-width="2.5"
        fill="none"
        stroke="currentColor"
      >
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.3-4.3"></path>
      </g>
    </svg>
    <input
      ref="globalSearchInput"
      type="search"
      class="grow"
      :placeholder="searchPlaceholder"
      v-model="keyword"
    />
    <span v-if="keyword.length < 1" class="min-w-[70px] text-end">
      <kbd class="kbd kbd-sm">Ctrl</kbd>
      <kbd class="kbd kbd-sm ml-1">/</kbd>
    </span>
    <span v-if="keyword.length > 0" class="min-w-[70px] text-end">
      <span class="px-1 py-2 cursor-pointer" @click="keyword = ''">✕</span>
    </span>
    <div
      v-if="keyword.length > 0 && keyword.length < searchMinChars"
      class="tooltip tooltip-bottom tooltip-open absolute left-[50%] top-8"
      :data-tip="searchMinChars - keyword.length + ' more character(s) to search'"
    ></div>
    <ul
      class="menu dropdown-content absolute right-0 top-[calc(0.5rem+100%)] min-w-[100%] max-h-[80vh] flex-nowrap overflow-auto bg-base-300 rounded-box z-1 p-2 shadow-sm"
      :class="{ hidden: filteredEndpoints.length < 1 }"
    >
      <li v-for="endpoint in filteredEndpoints" @click="selected(endpoint.data)">
        <div>
          <div
            class="badge badge-xs uppercase min-w-14 border-none"
            :style="{
                  color:
                    'var(' +
                    MethodColor[endpoint.data.method as string] +
                    '-content)',
                  backgroundColor:
                    'var(' + MethodColor[endpoint.data.method as string] + ')',
                }"
          >
            {{ endpoint.data.method }}
          </div>
          <span class="whitespace-nowrap" v-html="endpoint.html"></span>
        </div>
      </li>
    </ul>
  </label>

  <!--
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
--></template>
