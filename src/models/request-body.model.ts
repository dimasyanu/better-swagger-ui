export interface RequestBody {
    content: {[name: string]: RequestBodySchema}
}

interface RequestBodySchema {
    schema: {$ref: string}
}
