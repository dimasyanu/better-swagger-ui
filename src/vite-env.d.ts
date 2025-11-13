/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SWAGGER_DEFAULT_PATH: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
