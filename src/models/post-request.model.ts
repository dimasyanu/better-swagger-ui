import type { DefaultResponse } from './default-response.model'
import type { Dictionary } from './dictionary.model'
import type { SwaggerPostRequestBody } from './swagger-post-request-body.model'

export class PostRequest {
  constructor(
    public tags: string[] = [],
    public requestBody: SwaggerPostRequestBody,
    public responses: Dictionary<DefaultResponse>
  ) {}
}
