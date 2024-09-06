import type { Dictionary } from './dictionary.model'
import type { SwaggerPostRequestBodyContent } from './swagger-post-request-body-content.model'

export class SwaggerPostRequestBody {
  constructor(public content: Dictionary<SwaggerPostRequestBodyContent>) {}
}
