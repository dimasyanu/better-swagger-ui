import { isNullOrEmpty } from '@/helpers/helper'
import type { ApiSource } from '@/models/api-source.model'
import { defineStore } from 'pinia'
import { useSnackbarStore } from './snackbar.store'

export const useApiSourceStore = defineStore('sourceStore', {
  state: (): ApiSource => ({
    active: true,
    currentId: '',
    sources: [],
  }),
  getters: {
    currentSource(): string | undefined {
      if (isNullOrEmpty(this.currentId)) return undefined
      let currentSource = this.sources.find((x) => x.id === this.currentId)
      return currentSource?.name
    },
  },
  actions: {
    changeCurrentSource(id: string) {
      this.currentId = id
      this.saveToLocalStorage()
      this.closeSourceModal()

      useSnackbarStore().show('The source is changed to ' + this.currentSource)
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
    saveToLocalStorage() {
      localStorage.setItem(
        'api_source',
        JSON.stringify({
          active: this.active,
          currentId: this.currentId,
          sources: this.sources,
        })
      )
    },
  },
})
