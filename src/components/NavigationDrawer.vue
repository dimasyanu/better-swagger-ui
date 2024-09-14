<script setup lang="ts">
import api from '@/plugins/api'
import { useNavDrawerStore } from '@/stores/nav-drawer.store'
import { onMounted, ref } from 'vue'

const navDrawerFilters = ref({
  input: '',
  placeholder: 'Search',
})
const store = useNavDrawerStore()

onMounted(async () => {
  await api
    .getJson()
    .then((res) => store.storeTags(res))
    .catch((err) => {})
    .finally(() => {})
})

const showSubMenu = (menu: string) => {
  console.log(menu)
}
</script>

<template>
  <v-navigation-drawer floating permanent>
    <v-list density="compact" nav>
      <v-list-item class="pt-3 pb-2">
        <v-text-field
          id="group-search-input"
          :loading="false"
          class="d-sm-inline-block w-100"
          append-inner-icon="mdi-magnify"
          density="compact"
          label="Search"
          placeholder="Search"
          variant="outlined"
          hide-details
          single-line
          v-model="store.tagSearch"
        ></v-text-field>
      </v-list-item>

      <v-divider></v-divider>

      <v-list-item v-if="store.tags.length < 1" class="text-grey text-center">
        No endpoints
      </v-list-item>
      <v-list-item
        link
        v-for="(tag, i) of store.filteredTags"
        :key="i"
        append-icon="mdi-chevron-right"
        class="cursor-pointer hover:bg-grey-400"
        @hover="showSubMenu(tag)"
      >
        {{ tag }}
      </v-list-item>
      <v-list-item></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
