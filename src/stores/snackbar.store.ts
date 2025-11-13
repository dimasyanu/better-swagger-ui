import { defineStore } from 'pinia'
import { v4 as uuid } from 'uuid'

const defaultTimeout = 1500

export const SnackbarWarning = 'warning'
export const SnackbarInfo = 'info'
export const SnackbarSuccess = 'success'
export const SnackbarError = 'error'

export type SnackbarType =
  | typeof SnackbarWarning
  | typeof SnackbarInfo
  | typeof SnackbarSuccess
  | typeof SnackbarError

export interface SnackbarNotification {
  id: string
  message: string
  type: SnackbarType
  duration?: number
}

interface ISnackbarState {
  notifications: SnackbarNotification[]
  text: string
  active: boolean
}

export const useSnackbarStore = defineStore('snackbarStore', {
  state: (): ISnackbarState => ({
    notifications: [],
    text: '',
    active: false,
  }),
  actions: {
    push(notification: SnackbarNotification) {
      this.notifications.push(notification)

      let duration = defaultTimeout
      if (notification.duration && notification.duration > 0) {
        duration = notification.duration
      }
      setTimeout(() => {
        this.notifications = this.notifications.filter((n) => n.id !== notification.id)
      }, duration)
    },
    error(message: string, duration?: number) {
      this.push({ id: uuid(), message, type: SnackbarError, duration })
    },
    info(message: string, duration?: number) {
      this.push({ id: uuid(), message, type: SnackbarInfo, duration })
    },
    success(message: string, duration?: number) {
      this.push({ id: uuid(), message, type: SnackbarSuccess, duration })
    },
    warning(message: string, duration?: number) {
      this.push({ id: uuid(), message, type: SnackbarWarning, duration })
    },
  },
})
