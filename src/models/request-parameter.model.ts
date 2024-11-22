import type { RequestParameterSchema } from "./request-parameter-schema.model";


export interface RequestParameter {
    name: string    
    in: 'query' | 'path'
    required: boolean
    schema: RequestParameterSchema

}