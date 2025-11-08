<script setup lang="ts">
import { getColorForMethod } from '@/constants/colors.enum'
import { isNullOrEmpty } from '@/helpers/helper'
import { useGlobalStore } from '@/stores/global.store'
import { useNavDrawerStore } from '@/stores/nav-drawer.store'
import ChevronRightIcon from './icons/ChevronRightIcon.vue'

const globalStore = useGlobalStore()
const store = useNavDrawerStore()
</script>

<template>
  <div
    id="sidenav"
    class="bg-base-100 py-3 shadow-md h-full relative z-2"
    :class="{ hidden: !globalStore.isNavDrawerOpen }"
  >
    <div class="px-4">
      <input type="text" placeholder="Filter.." class="input" />
    </div>

    <div class="divider my-2"></div>

    <div v-if="store.filteredTags.length < 1" class="text-center text-secondary my-6">
      No endpoints
    </div>

    <ul
      class="menu h-[88%] overflow-auto flex flex-column flex-nowrap bg-base-100 rounded-box w-64 px-4"
    >
      <li
        v-for="(tag, i) of store.filteredTags"
        :key="i"
        :class="{ active: globalStore.currentTag === tag }"
        @click="globalStore.setCurrentTag(tag)"
      >
        <div class="flex flex-row justify-between p-0">
          <a class="px-3">{{ tag }}</a>
          <div
            class="menu-toggle-icon btn btn-sm relative px-2 rounded-l-none border-0 bg-transparent opacity-20 hover:opacity-75 transition-all duration-200"
          >
            <ChevronRightIcon />
            <div class="absolute top-0 right-0 translate-x-[80%] z-99">
              <ul class="menu menu-sm bg-base-200 rounded-box w-56">
                <li><a>Small 1</a></li>
                <li><a>Small 2</a></li>
              </ul>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
  <!--  
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
--></template>

<style lang="scss" scoped>
.menu li:hover btn,
.menu li .btn:hover {
  background-color: color-mix(in oklab, var(--color-base-content) 10%, var(--color-base-100));
}

#sidenav > .menu {
  li {
    .btn {
      opacity: 0;

      &.menu-toggle-icon {
        ul.menu {
          opacity: 0;
        }

        &:hover {
          ul.menu {
            opacity: 1;
            // right: 0;
            // transition: right 0.2s ease-in-out;
          }
        }
      }
    }

    &:hover {
      & > div {
        .btn {
          opacity: 0.5;

          &:hover {
            opacity: 0.75;
          }
        }
      }
    }

    &.active {
      & > div {
        color: var(--menu-active-fg);
        background-color: var(--menu-active-bg);

        .btn {
          color: var(--menu-active-fg);
          background-color: var(--menu-active-bg);
        }
      }
    }
  }
}
</style>
