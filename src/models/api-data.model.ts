import type { IRequestModel } from '@/abstractions/i-request.model'
import { ApiMethod } from '@/constants/api-method.enum'

export class ApiData {
  constructor(public tag: string, public endpoints: ApiEndpoint[]) {}
}

export class ApiEndpoint {
  constructor(
    public path: string,
    public request: IRequestModel,
    public method:
      | ApiMethod.GET
      | ApiMethod.POST
      | ApiMethod.PUT
      | ApiMethod.DELETE = ApiMethod.GET
  ) {}
}
