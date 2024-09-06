import { Dictionary } from './dictionary.model'
import { SwaggerSchemaProperty } from './swagger-schema-property.model'

export class SwaggerSchema {
  constructor(
    public additionalProperties: boolean = false,
    public type: string,
    public properties: Dictionary<SwaggerSchemaProperty> = new Dictionary<SwaggerSchemaProperty>()
  ) {}
}
