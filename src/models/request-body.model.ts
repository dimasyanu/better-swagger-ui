import type { SwaggerSchemaProperty } from "./swagger-schema-property.model"

export interface RequestBody {
    content: {[name: string]: RequestBodySchema}
}

interface RequestBodySchema {
    schema: {$ref: string, properties: {[name:string]: SwaggerSchemaProperty}[]}
}
