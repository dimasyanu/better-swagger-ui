import type { IRequestModel } from '@/abstractions/i-request.model'
import { ApiMethod, type ApiMethodType } from '@/constants/api-method.enum'

export class ApiData {
  constructor(public tag: string, public endpoints: ApiEndpoint[]) { }
}

export class ApiEndpoint {
  constructor(
    public path: string,
    public request: IRequestModel,
    public method: ApiMethodType = ApiMethod.GET
  ) { }
}
