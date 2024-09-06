import { Dictionary } from './dictionary.model'
import { SwaggerSchema } from './swagger-schema.model'
import type { SwaggerSecurityScheme } from './swagger-security-scheme.model'

export class SwaggerComponents {
  constructor(
    public schemas: Dictionary<SwaggerSchema> = new Dictionary<SwaggerSchema>(),
    public securitySchemes: Dictionary<SwaggerSecurityScheme> = new Dictionary<SwaggerSecurityScheme>()
  ) {}
}
