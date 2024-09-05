declare global {
  interface String {
    isNullOrEmpty(val: string): boolean
  }
}

/// <reference types="vite/client" />
