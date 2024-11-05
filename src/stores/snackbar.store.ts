import { defineStore } from 'pinia'

interface ISnackbarState {
  text: string
  active: boolean
  timeout: number
}

export const useSnackbarStore = defineStore('snackbarStore', {
  state: (): ISnackbarState => ({
    text: '',
    active: false,
    timeout: 2000,
  }),
  actions: {
    setText(text: string) {
      this.text = text
    },
    setTimeout(timeout: number) {
      this.timeout = timeout
    },
    show(text: string | null = null, timeout: number | null = null) {
      if (text !== null) this.setText(text)
      if (timeout !== null) this.setTimeout(timeout)
      this.active = true
    },
  },
})
