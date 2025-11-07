import { ApiMethod } from './api-method.enum'

enum MethodColorLightMode {
  GET = '--color-info',
  POST = '--color-success',
  PATCH = 'amber-lighten-1',
  PUT = 'amber-lighten-1',
  DELETE = 'red-lighten-1',
}

enum MethodColorDarkMode {
  GET = 'blue',
  POST = 'green',
  PATCH = 'amber',
  PUT = 'amber',
  DELETE = 'red',
}

export const getColorForMethod = function (method: string, isDarkMode: boolean) {
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
