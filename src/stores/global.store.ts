import { isNullOrEmpty } from '@/helpers/helper'
import type { SwaggerRoot } from '@/models/swagger-root.model'
import { defineStore } from 'pinia'

export class GlobalState {
  constructor(public isDarkMode: boolean = false, public tags: string[] = []) {}
}

export const useGlobalStore = defineStore('global', {
  state: () => new GlobalState(),
  getters: {},
  actions: {
    toggleThemeMode() {
      this.changeThemeMode(!this.isDarkMode)
    },
    changeThemeMode(state: boolean = false) {
      localStorage.setItem('is_dark_mode', state.toString())
      this.isDarkMode = state
    },
    initializeThemeMode() {
      let isDarkMode = localStorage.getItem('is_dark_mode')
      if (isNullOrEmpty(isDarkMode)) {
        this.changeThemeMode(false)
        return
      }

      this.changeThemeMode(isDarkMode!.toLowerCase() === 'true')
    },
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
