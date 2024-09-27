import { isNullOrEmpty } from '@/helpers/helper'
import { defineStore } from 'pinia'
import { useGlobalStore } from './global.store'
import { computed, ref } from 'vue'

export const useNavDrawerStore = defineStore('navDrawer', () => {
  const globalStore = useGlobalStore()

  const tagSearch = ref('')

  const filteredTags = computed(() => {
    var keyword = tagSearch.value.trim().toLowerCase()
    let tags = globalStore.tagList
    if (isNullOrEmpty(keyword)) return tags
    return tags.filter((x) => x.toLowerCase().includes(keyword))
  })

  const clearSearch = () => {
    tagSearch.value = ''
  }

  return { clearSearch, tagSearch, filteredTags }
})
