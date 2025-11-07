import { ApiMethod, type ApiMethodType } from './api-method.enum'

enum MethodColorLightMode {
  GET = '--color-info',
  POST = '--color-success',
  PATCH = '--color-warning',
  PUT = '--color-warning',
  DELETE = '--color-error',
}

enum MethodColorDarkMode {
  GET = 'blue',
  POST = 'green',
  PATCH = 'amber',
  PUT = 'amber',
  DELETE = 'red',
}

export const getColorForMethod = function (method: ApiMethodType, isDarkMode: boolean) {
  if (!isDarkMode) {
    if (method === ApiMethod.POST) return MethodColorLightMode.POST
    if (method === ApiMethod.PUT) return MethodColorLightMode.PUT
    if (method === ApiMethod.PATCH) return MethodColorLightMode.PATCH
    if (method === ApiMethod.DELETE) return MethodColorLightMode.DELETE
    return MethodColorLightMode.GET
  }

  if (method === ApiMethod.POST) return MethodColorDarkMode.POST
  if (method === ApiMethod.PUT) return MethodColorDarkMode.PUT
  if (method === ApiMethod.PATCH) return MethodColorDarkMode.PATCH
  if (method === ApiMethod.DELETE) return MethodColorDarkMode.DELETE
  return MethodColorDarkMode.GET
}
