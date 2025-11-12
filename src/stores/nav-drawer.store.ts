import { isNullOrEmpty } from '@/helpers/helper'
import { defineStore } from 'pinia'
import { useGlobalStore } from './global.store'
import { computed, ref } from 'vue'

export const useNavDrawerStore = defineStore('navDrawer', () => {
  const globalStore = useGlobalStore()

  const tagSearch = ref('')

  const filteredTags = computed(() => {
    const keyword = tagSearch.value.trim()
    let tags = globalStore.tagList

    if (!isNullOrEmpty(keyword)) {
      let regex: RegExp
      try {
        regex = new RegExp(keyword, 'i')
      } catch {
        const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        regex = new RegExp(escaped, 'i')
      }

      tags = tags.filter((x) => regex.test(x))
      return tags.map<{ key: string, html: string }>(x => ({
        key: x,
        html: x.replace(regex, (match) => `<span class="highlight">${match}</span>`),
      }))
    }

    return tags.map<{ key: string, html: string }>(x => ({ key: x, html: x }))
  })

  const clearSearch = () => {
    tagSearch.value = ''
  }

  const toggleNavDrawer = () => {
    globalStore.isNavDrawerOpen = !globalStore.isNavDrawerOpen
  }

  return { toggleNavDrawer, clearSearch, tagSearch, filteredTags }
})