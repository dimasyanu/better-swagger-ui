<script setup lang="ts">
import { MethodColor } from '@/constants/colors.enum'
import { useGlobalStore } from '@/stores/global.store'
import { useNavDrawerStore } from '@/stores/nav-drawer.store'
import ChevronRightIcon from './icons/ChevronRightIcon.vue'
import { computed, ref } from 'vue'

const subMenuId = '--submenu--'

const globalStore = useGlobalStore()
const store = useNavDrawerStore()

const currentHoveredKeys = ref<string[]>([])
const subMenuPos = ref<{ x: number; y: number } | null>(null)

const currentHoveredTag = computed<string | undefined>(() => {
  const list = currentHoveredKeys.value.filter((x) => x !== subMenuId)
  return list.length > 0 ? list[list.length - 1] : undefined
})
const hoveredSubMenuItems = computed(() => {
  const tag = currentHoveredTag.value
  if (!tag) return []
  return globalStore.apiData.find((x) => x.tag === tag)?.endpoints ?? []
})

const pushSubMenu = (menu: string) => {
  currentHoveredKeys.value.push(menu)

  if (menu === subMenuId) return
  const menuItem = <HTMLElement>document.getElementById('menu-' + menu)

  if (!menuItem) return
  const rect = menuItem.getBoundingClientRect()
  const windowHeight = window.innerHeight || document.documentElement.clientHeight

  // submenu too tall to fit in viewport, position at top
  if (16 + 32 * hoveredSubMenuItems.value.length > windowHeight) {
    subMenuPos.value = { x: rect.right, y: 8 }
    return
  }

  // adjust y position to fit in viewport
  if (rect.top + 16 + 32 * hoveredSubMenuItems.value.length > windowHeight) {
    subMenuPos.value = {
      x: rect.right,
      y: windowHeight - 32 * hoveredSubMenuItems.value.length - 8,
    }
    return
  }
  subMenuPos.value = { x: rect.right, y: rect.top }
}

const hideSubMenu = (menu: string) => {
  setTimeout(() => {
    const keys = currentHoveredKeys.value
    if (keys[keys.length - 1] === menu) {
      currentHoveredKeys.value = []
      subMenuPos.value = null
    }
  }, 100)
}
</script>

<template>
  <div
    id="sidenav"
    class="bg-base-300 py-3 shadow-md h-full relative z-2"
    :class="{ hidden: !globalStore.isNavDrawerOpen }"
  >
    <div class="px-4">
      <label class="input input-sm" for="menu-filter">
        <input
          id="menu-filter"
          type="search"
          placeholder="Filter.."
          class="grow"
          v-model="store.tagSearch"
        />
        <div class="tooltip tooltip-bottom" data-tip="Clear">
          <span
            v-if="store.tagSearch !== ''"
            class="px-1 py-2 cursor-pointer"
            @click="store.tagSearch = ''"
          >
            ✕
          </span>
        </div>
      </label>
    </div>

    <div class="divider my-2"></div>

    <div v-if="store.filteredTags.length < 1" class="text-center text-secondary my-6">
      No endpoints
    </div>

    <ul
      class="menu h-[88%] overflow-y-auto flex flex-column flex-nowrap bg-base-300 rounded-box w-64 px-4"
    >
      <li
        v-for="(tag, i) of store.filteredTags"
        :key="i"
        :id="'menu-' + tag.key"
        :class="{ active: globalStore.currentTag === tag.key }"
        @click="globalStore.setCurrentTag(tag.key)"
      >
        <div class="flex flex-row justify-between p-0">
          <a class="px-3" v-html="tag.html"></a>
          <div
            class="menu-toggle-icon btn btn-sm px-2 rounded-l-none border-0 bg-transparent transition-all duration-200"
            @mouseenter="pushSubMenu(tag.key)"
            @mouseleave="hideSubMenu(tag.key)"
          >
            <ChevronRightIcon />
          </div>
        </div>
      </li>
    </ul>

    <!-- Submenu -->
    <div
      class="absolute z-999 overflow-y-auto max-h-[100vh]"
      :class="{
        'opacity-70': currentHoveredKeys.length <= 0,
        'opacity-100': currentHoveredKeys.length > 0,
      }"
      :style="{
        top: subMenuPos ? subMenuPos.y + 'px' : 'auto',
        left: subMenuPos ? subMenuPos.x + 'px' : 'auto',
      }"
      @mouseenter="pushSubMenu(subMenuId)"
      @mouseleave="hideSubMenu(subMenuId)"
    >
      <ul
        class="menu menu-md bg-base-100 rounded-box"
        :class="{ hidden: hoveredSubMenuItems.length < 1 }"
      >
        <li
          v-for="(endpoint, j) in hoveredSubMenuItems"
          :key="j"
          :class="{ active: globalStore.currentEndpointIndex === j }"
        >
          <div @click="globalStore.selectEndpoint(currentHoveredTag ?? '', j)">
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
      opacity: 0;

      &.menu-toggle-icon {
        ul.menu {
          opacity: 0;
        }

        &:hover {
          ul.menu {
            opacity: 1;
            right: 0;
            transition: right 0.2s ease-in-out;
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
        color: var(--color-primary-content);
        background-color: var(--color-primary);

        .btn {
          color: var(--color-primary-content);
          background-color: var(--color-primary);
        }
      }
    }
  }
}
</style>
