import { isNullOrEmpty } from '@/helpers/helper'
import type { SwaggerRoot } from '@/models/swagger-root.model'
import { defineStore } from 'pinia'

export const useNavDrawerStore = defineStore('navDrawer', {
  state: () => ({
    tags: [''],
    tagSearch: '',
  }),
  getters: {
    filteredTags(): string[] {
      var keyword = this.tagSearch.trim().toLowerCase()
      if (isNullOrEmpty(keyword)) return this.tags
      return this.tags.filter((x) => x.toLowerCase().includes(keyword))
    },
  },
  actions: {
    storeTags(root: SwaggerRoot) {
      let tags: string[] = []
      for (let path in root.paths) {
        let req = root.paths[path]
        if (req.get) {
          for (let tag of req.get.tags) {
            if (tags.includes(tag)) continue
            tags.push(tag)
          }
        }

        if (req.post) {
          for (let tag of req.post.tags) {
            if (tags.includes(tag)) continue
            tags.push(tag)
          }
        }
      }
      this.tags = tags.sort()
    },
  },
})
