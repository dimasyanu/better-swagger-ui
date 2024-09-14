import { isNullOrEmpty } from '@/helpers/helper'
import { ApiData, ApiEndpoint } from '@/models/api-data.model'
import type { SwaggerRoot } from '@/models/swagger-root.model'
import { defineStore } from 'pinia'

interface IGlobalState {
  isDarkMode: boolean
  apiData: ApiData[]
}

export const useGlobalStore = defineStore('global', {
  state: (): IGlobalState => ({
    isDarkMode: false,
    apiData: []
  }),
  getters: {
    tagList(): string[] {
      return this.apiData.map(x => x.tag)
    }
  },
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
    storeData(root: SwaggerRoot) {
      for (let path in root.paths) {
        let req = root.paths[path]
        if (req.get) {
          for (let tag of req.get.tags) {
            let currentApiData = this.apiData.find(x => x.tag === tag)
            if (currentApiData === undefined || currentApiData === null) {
              currentApiData = new ApiData(tag, [])
              this.apiData.push(currentApiData)
            }
            currentApiData.endpoints.push(new ApiEndpoint(path, req.get))
          }
          continue
        }

        if (req.post) {
          for (let tag of req.post.tags) {
            let currentApiData = this.apiData.find(x => x.tag === tag)
            if (currentApiData === undefined || currentApiData === null) {
              currentApiData = new ApiData(tag, [])
              this.apiData.push(currentApiData)
            }
            currentApiData.endpoints.push(new ApiEndpoint(path, req.post))
          }
          continue
        }
      }
    }
  },
})
