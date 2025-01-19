import type { IRequestModel } from '@/abstractions/i-request.model'
import type { DefaultResponse } from './default-response.model'
import type { Dictionary } from './dictionary.model'
import type { SwaggerPostRequestBody } from './swagger-post-request-body.model'
import type { RequestParameter } from './request-parameter.model'

export class PostRequest implements IRequestModel {
  constructor(
    public tags: string[] = [],
    public summary: string = '',
    public requestBody: SwaggerPostRequestBody,
    public parameters: RequestParameter[],
    public responses: Dictionary<DefaultResponse>,
  ) {}
}
