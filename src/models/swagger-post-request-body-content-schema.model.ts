import { type IRequestBodySchema } from '../abstractions/i-request-body-schema.model'

export class SwaggerPostRequestBodyContentSchema implements IRequestBodySchema {
  constructor(public $ref: string = '') {}
}
