import { SwaggerPostRequestBodyContentSchema } from './swagger-post-request-body-content-schema.model'

export class SwaggerPostRequestBodyContent {
  constructor(
    public schema: SwaggerPostRequestBodyContentSchema = new SwaggerPostRequestBodyContentSchema()
  ) {}
}
