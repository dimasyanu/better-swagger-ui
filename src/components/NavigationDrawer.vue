<script setup lang="ts">
import { MethodColor } from '@/constants/colors.enum'
import { useGlobalStore } from '@/stores/global.store'
import { useNavDrawerStore } from '@/stores/nav-drawer.store'
import ChevronRightIcon from './icons/ChevronRightIcon.vue'
import { computed, ref, useTemplateRef } from 'vue'

const subMenuId = '--submenu--'

const globalStore = useGlobalStore()
const store = useNavDrawerStore()

const currentHoveredTags = ref<string[]>([])
const subMenuPos = ref<{ x: number; y: number } | null>(null)

const currentHoveredTag = computed<string | undefined>(() => {
  const list = currentHoveredTags.value.filter((x) => x !== subMenuId)
  return list.length > 0 ? list[list.length - 1] : undefined
})

const pushSubMenu = (menu: string) => {
  if (currentHoveredTags.value.includes(menu)) return
  currentHoveredTags.value.push(menu)

  if (menu === subMenuId) return
  const menuItem = <HTMLElement>document.getElementById('menu-' + menu)
  if (!menuItem) return
  const rect = menuItem.getBoundingClientRect()
  subMenuPos.value = { x: rect.right, y: rect.top }
}
const hideSubMenu = (menu: string) => {
  if (!currentHoveredTags.value.includes(subMenuId))
    currentHoveredTags.value = currentHoveredTags.value.filter((x) => x !== menu)

  setTimeout(() => {
    if (currentHoveredTags.value.includes(subMenuId) && menu !== subMenuId) return
    if (currentHoveredTag.value) return
    // if (currentHoveredTags.value.length > 0) return
    currentHoveredTags.value = []
    subMenuPos.value = null
  }, 100)
}
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
      class="menu h-[88%] overflow-y-auto flex flex-column flex-nowrap bg-base-100 rounded-box w-64 px-4"
    >
      <li
        v-for="(tag, i) of store.filteredTags"
        :key="i"
        :id="'menu-' + tag"
        :class="{ active: globalStore.currentTag === tag }"
        @click="globalStore.setCurrentTag(tag)"
      >
        <div class="flex flex-row justify-between p-0">
          <a class="px-3">{{ tag }}</a>
          <div
            class="menu-toggle-icon btn btn-sm px-2 rounded-l-none border-0 bg-transparent transition-all duration-200"
            @mouseenter="pushSubMenu(tag)"
            @mouseleave="hideSubMenu(tag)"
          >
            <ChevronRightIcon />
          </div>
        </div>
      </li>
    </ul>
    <div
      class="absolute z-999"
      :class="{
        'opacity-70': currentHoveredTags.length <= 0,
        'opacity-100': currentHoveredTags.length > 0,
      }"
      :style="{
        top: subMenuPos ? subMenuPos.y + 'px' : 'auto',
        left: subMenuPos ? subMenuPos.x + 'px' : 'auto',
      }"
      @mouseenter="pushSubMenu(subMenuId)"
      @mouseleave="hideSubMenu(subMenuId)"
    >
      <ul class="menu menu-md bg-base-100 rounded-box">
        <li
          v-for="(endpoint, j) in globalStore.apiData.find((x) => x.tag === currentHoveredTag)
            ?.endpoints ?? []"
          :key="j"
        >
          <div>
            <div
              class="badge badge-xs uppercase min-w-14 border-none"
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
            <span class="text-sm whitespace-nowrap">
              {{ endpoint.path }}
            </span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.menu li:hover btn,
.menu li .btn:hover {
  background-color: color-mix(in oklab, var(--color-base-content) 10%, var(--color-base-100));
}

#sidenav > .menu {
  li {
    .btn {
      // opacity: 0;

      &.menu-toggle-icon {
        // ul.menu {
        // opacity: 0;
        // }

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
          // opacity: 0.5;

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
