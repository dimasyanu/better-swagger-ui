export enum ApiMethod {
  GET = 'get',
  POST = 'post',
  PATCH = 'patch',
  PUT = 'put',
  DELETE = 'delete',
}

export type ApiMethodType = ApiMethod.GET | ApiMethod.POST | ApiMethod.PATCH | ApiMethod.PUT | ApiMethod.DELETE | undefined