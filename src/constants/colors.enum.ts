import { ApiMethod } from './api-method.enum'

enum MethodColorLightMode {
  GET = 'blue-lighten-1',
  POST = 'green-lighten-1',
  PUT = 'amber-lighten-1',
  DELETE = 'red-lighten-1',
}

enum MethodColorDarkMode {
  GET = 'blue',
  POST = 'green',
  PUT = 'amber',
  DELETE = 'red',
}

export const getColorForMethod = function (
  method: string,
  isDarkMode: boolean
) {
  if (!isDarkMode) {
    if (method === ApiMethod.POST) return MethodColorLightMode.POST
    if (method === ApiMethod.PUT) return MethodColorLightMode.PUT
    if (method === ApiMethod.DELETE) return MethodColorLightMode.DELETE
    return MethodColorLightMode.GET
  }

  if (method === ApiMethod.POST) return MethodColorDarkMode.POST
  if (method === ApiMethod.PUT) return MethodColorDarkMode.PUT
  if (method === ApiMethod.DELETE) return MethodColorDarkMode.DELETE
  return MethodColorDarkMode.GET
}
