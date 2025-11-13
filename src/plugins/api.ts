import type { SwaggerRoot } from '@/models/swagger-root.model'

export default {
  get<TResult>(url: string): Promise<TResult> {
    return fetch(url).then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      return response.json() as Promise<TResult>
    }) as Promise<TResult>
  },

  getJson(): Promise<SwaggerRoot> {
    var swaggerJsonPath =
      localStorage.getItem('swagger_json_path') ??
      import.meta.env.VITE_SWAGGER_DEFAULT_PATH ??
      '/swagger.test.json'

    const parsed = this.get<SwaggerRoot>(swaggerJsonPath)
    return parsed
  },
}
