import type { IRequestBodySchema } from '@/abstractions/i-request-body-schema.model'

export class SwaggerPostRequestBody {
  constructor(public content: { [name: string]: { schema: IRequestBodySchema } }) {}
}
