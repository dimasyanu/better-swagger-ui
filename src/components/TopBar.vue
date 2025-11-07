<script setup lang="ts">
import GlobalSearch from '@/components/partials/GlobalSearch.vue'
import SourceModal from './partials/SourceModal.vue'
import { useGlobalStore } from '@/stores/global.store'
import { useApiSourceStore } from '@/stores/api-source.store'
import LinkIcon from './icons/LinkIcon.vue'
import LockIcon from './icons/LockIcon.vue'
import SwaggerIcon from './icons/SwaggerIcon.vue'
import MenuIcon from './icons/MenuIcon.vue'
import { useNavDrawerStore } from '@/stores/nav-drawer.store'

const globalStore = useGlobalStore()
const sourceStore = useApiSourceStore()
const navBarStore = useNavDrawerStore()

const toggleTheme = () => {
  globalStore.toggleThemeMode()

  document.querySelector('#theme-toggle')?.setAttribute('aria-label', globalStore.theme)
}
</script>

<template>
  <div class="navbar bg-base-100 shadow-sm">
    <div class="flex flex-row w-full justify-between items-center">
      <!-- Logo/Title -->
      <div class="flex flex-row items-center gap-2 mr-4 px-2">
        <div
          class="tooltip tooltip-right mr-4"
          data-tip="Toggle Navigation Drawer"
          :class="{
            'tooltip-bottom': globalStore.isNavDrawerOpen,
            'tooltip-right': !globalStore.isNavDrawerOpen,
          }"
        >
          <div class="btn btn-circle" @click="navBarStore.toggleNavDrawer">
            <MenuIcon />
          </div>
        </div>
        <SwaggerIcon width="48px" />
        <h2>Better Swagger UI</h2>
      </div>

      <!-- Source & Authorization -->
      <div class="flex flex-row gap-2 mr-4">
        <div
          class="tooltip tooltip-bottom"
          :data-tip="'Source: ' + (sourceStore.currentSource ?? 'None')"
        >
          <div class="btn btn-soft btn-info" @click="sourceStore.openSourceModal">
            <LinkIcon />
            <span>Source</span>
          </div>
        </div>
        <div class="btn btn-soft btn-success">
          <LockIcon />
          <span>Auth</span>
        </div>
      </div>

      <div class="flex flex-row items-center gap-16 px-4">
        <!-- Global search -->
        <div>
          <GlobalSearch />
        </div>

        <!-- Theme mode -->
        <div
          id="theme-toggle"
          class="theme-toggle cursor-pointer"
          title="Toggles light & dark"
          aria-label="auto"
          aria-live="polite"
          @click="toggleTheme"
        >
          <svg class="sun-and-moon" aria-hidden="true" width="32px" viewBox="0 0 24 24">
            <mask class="moon" id="moon-mask">
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              <circle cx="24" cy="10" r="6" fill="black" />
            </mask>
            <circle class="sun" cx="12" cy="12" r="6" mask="url(#moon-mask)" fill="currentColor" />
            <g class="sun-beams" stroke="currentColor">
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  </div>
  <SourceModal />
</template>
