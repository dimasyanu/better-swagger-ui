import { isNullOrEmpty } from '@/helpers/helper'
import { ApiSource } from '@/models/api-source.model'
import { defineStore } from 'pinia'
import { useSnackbarStore } from './snackbar.store'
import { ApiSourceItem } from '../models/api-source.model'
import { useGlobalStore } from './global.store'
import api from '@/plugins/api'
import type { SwaggerRoot } from '@/models/swagger-root.model'

export const useApiSourceStore = defineStore('sourceStore', {
  state: (): ApiSource => ({
    active: false,
    currentId: '',
    sources: [],
  }),
  getters: {
    currentSource(): string | undefined {
      if (isNullOrEmpty(this.currentId)) return undefined
      let currentSource = this.sources.find((x) => x.id === this.currentId)
      return currentSource?.name
    },
    currentSourceUrl(): string | undefined {
      if (isNullOrEmpty(this.currentId)) return undefined
      let currentSource = this.sources.find((x) => x.id === this.currentId)
      return currentSource?.jsonUrl
    },
  },
  actions: {
    changeCurrentSource(id: string) {
      this.currentId = id
      this.saveToLocalStorage()
      this.closeSourceModal()

      this.fetchFromSource()
      useSnackbarStore().show('The source is changed to ' + this.currentSource)
    },
    addSource(item: ApiSourceItem) {
      this.sources.push(item)
      this.saveToLocalStorage()
    },
    updateSource(item: ApiSourceItem) {
      this.$patch((state) => {
        let source = state.sources.find((x) => x.id === item.id)
        if (source == null) return
        source!.name = item.name
        source!.jsonUrl = item.jsonUrl
      })
      this.saveToLocalStorage()
    },
    removeSource(id: string) {
      let source = this.sources.find((x) => x.id === id)
      if (
        source == null ||
        !window.confirm('Are you sure you want to remove this source: ' + source.name + '?')
      )
        return
      let sourceName = source.name
      this.sources = this.sources.filter((x) => x.id !== id)
      this.saveToLocalStorage()

      useSnackbarStore().show('Removed: ' + sourceName)
    },
    openSourceModal() {
      this.active = true
    },
    closeSourceModal() {
      this.active = false
    },
    fetchFromSource() {
      if (this.currentSourceUrl == null) return

      const globalStore = useGlobalStore()
      globalStore.clearData()

      api
        .get<SwaggerRoot>(this.currentSourceUrl!)
        .then((res) => globalStore.storeData(res))
        .catch((err) => {})
        .finally(() => {})
    },
    saveToLocalStorage() {
      localStorage.setItem(
        'api_source',
        JSON.stringify(new ApiSource(this.active, this.currentId, this.sources))
      )
    },
    loadFromLocalStorage() {
      let strJson = localStorage.getItem('api_source')
      if (isNullOrEmpty(strJson)) return
      let deserialized = JSON.parse(strJson!) as ApiSource
      this.sources = deserialized.sources
      this.currentId = deserialized.currentId
    },
  },
})
