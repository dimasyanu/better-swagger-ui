import type { IRequestModel } from '@/abstractions/i-request.model'
import type { DefaultResponse } from './default-response.model'
import type { Dictionary } from './dictionary.model'
import type { RequestParameter } from './request-parameter.model'

export class GetRequest implements IRequestModel {
  constructor(
    public tags: string[] = [],
    public summary: string = '',
    public parameters: RequestParameter[] = [],
    public responses: Dictionary<DefaultResponse>
  ) {}
}
