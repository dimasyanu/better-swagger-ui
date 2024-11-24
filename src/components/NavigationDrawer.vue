<script setup lang="ts">
import { getColorForMethod } from '@/constants/colors.enum'
import { isNullOrEmpty } from '@/helpers/helper'
import { useGlobalStore } from '@/stores/global.store'
import { useNavDrawerStore } from '@/stores/nav-drawer.store'

const globalStore = useGlobalStore()
const store = useNavDrawerStore()
</script>

<template>
  <v-navigation-drawer>
    <v-list class="pb-5">
      <v-list-item class="pb-2">
        <v-text-field
          id="group-search-input"
          :loading="false"
          class="d-sm-inline-block w-100"
          clear-icon="mdi-close"
          append-inner-icon="mdi-magnify"
          density="compact"
          label="Search"
          placeholder="Search"
          variant="outlined"
          hide-details
          single-line
          v-model="store.tagSearch"
          clearable
          @click:clear="store.clearSearch()"
        ></v-text-field>
      </v-list-item>

      <v-divider></v-divider>

      <v-list-item v-if="store.filteredTags.length < 1" class="text-grey text-center">
        No endpoints
      </v-list-item>

      <v-list-item
        link
        v-for="(tag, i) of store.filteredTags"
        :key="i"
        :active="globalStore.currentTag === tag"
        @click="globalStore.setCurrentTag(tag)"
      >
        {{ tag }}
        <div
          class="submenu-toggle inline-block absolute h-full t-0 r-0 px-3 d-flex align-center cursor-default"
          :class="{ dark: globalStore.isDarkMode }"
        >
          <v-icon icon="mdi-chevron-right"></v-icon>
          <v-menu
            :open-on-focus="false"
            activator="parent"
            open-delay="50"
            close-delay="50"
            open-on-hover
            submenu
          >
            <v-list class="py-0">
              <v-list-item
                link
                v-for="(endpoint, j) in globalStore.apiData.find(x => x.tag === tag)!.endpoints"
                :key="j"
                :active="globalStore.currentEndpointIndex === j"
                @click="globalStore.selectEndpoint(tag, j)"
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
                <v-list-item-title class="inline">
                  {{ endpoint.path }}
                </v-list-item-title>
                <v-tooltip
                  v-if="!isNullOrEmpty(endpoint.request.summary)"
                  activator="parent"
                  location="end"
                >
                  {{ endpoint.request.summary }}
                </v-tooltip>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
