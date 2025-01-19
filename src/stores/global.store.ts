import { ApiMethod } from '@/constants/api-method.enum'
import { isNullOrEmpty } from '@/helpers/helper'
import { ApiData, ApiEndpoint } from '@/models/api-data.model'
import type { SwaggerRoot } from '@/models/swagger-root.model'
import type { SwaggerSchema } from '@/models/swagger-schema.model'
import { defineStore } from 'pinia'

interface IGlobalState {
  isDarkMode: boolean
  apiData: ApiData[]
  schemas: SwaggerSchema[]
  currentTag: string
  currentEndpointIndex: number | null
  searchKeyword: string
}

export const useGlobalStore = defineStore('global', {
  state: (): IGlobalState => ({
    isDarkMode: false,
    apiData: [],
    schemas: [],
    currentTag: '',
    currentEndpointIndex: null,
    searchKeyword: '',
  }),
  getters: {
    tagList(): string[] {
      return this.apiData.map((x) => x.tag)
    },
    currentEndpoints(): ApiEndpoint[] {
      if (
        isNullOrEmpty(this.currentTag) ||
        this.apiData.findIndex((x) => x.tag === this.currentTag) < 0
      )
        return []

      return this.apiData.find((x) => x.tag === this.currentTag)?.endpoints!
    },
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
    clearSearch() {
      this.searchKeyword = ''
    },
    setCurrentTag(tag: string) {
      this.currentTag = tag
      this.currentEndpointIndex = null
    },
    selectEndpoint(tag: string, endpointIndex: number) {
      this.currentTag = tag
      this.currentEndpointIndex = endpointIndex
    },
    selectEndpointByPath(tag: string, path: string) {
      this.currentTag = tag
      let endpointIndex = this.currentEndpoints.findIndex((x) => x.path === path)
      if (endpointIndex < 0) {
        this.currentEndpointIndex = null
        return
      }
      this.currentEndpointIndex = endpointIndex
    },
    storeData(root: SwaggerRoot) {
      // Store paths
      for (let path in root.paths) {
        let req = root.paths[path]
        if (req.get) {
          for (let tag of req.get.tags) {
            let currentApiData = this.apiData.find((x) => x.tag === tag)
            if (currentApiData === undefined || currentApiData === null) {
              currentApiData = new ApiData(tag, [])
              this.apiData.push(currentApiData)
            }
            currentApiData.endpoints.push(new ApiEndpoint(path, req.get, ApiMethod.GET))
          }
          continue
        }

        if (req.post) {
          for (let tag of req.post.tags) {
            let currentApiData = this.apiData.find((x) => x.tag === tag)
            if (currentApiData === undefined || currentApiData === null) {
              currentApiData = new ApiData(tag, [])
              this.apiData.push(currentApiData)
            }
            currentApiData.endpoints.push(new ApiEndpoint(path, req.post, ApiMethod.POST))
          }
          continue
        }
      }

      // Store schemas
      for (let schema in root.components.schemas) {
        let schemaData = root.components.schemas[schema]
        schemaData.name = schema
        this.schemas.push(schemaData)
        // this.schemas.push({ key: req })
      }

      // Set default tag
      if (isNullOrEmpty(this.currentTag) && this.apiData.length > 0) {
        this.setCurrentTag(this.apiData[0].tag)
      }
    },
    clearData() {
      this.currentTag = ''
      this.apiData = []
      this.currentEndpointIndex = null
      this.searchKeyword = ''
    },
  },
})
