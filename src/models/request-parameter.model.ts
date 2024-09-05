import type { RequestParameterSchema } from "./request-parameter-schema.model";

export class RequestParameter {
  constructor(
    public name: string = '',
    public In: 'query' | 'path' = 'query',
    public schema: RequestParameterSchema
  ){}
}