import type { SwaggerSchemaProperty } from "../swagger-schema-property.model";

export class SwaggerSchema {
    constructor(
        public type: string = 'object',
        public required: string[] = [],
        public additionalProperties: boolean = false,
        public properties: {[name:string]: SwaggerSchemaProperty}[] = []
    ){}
}