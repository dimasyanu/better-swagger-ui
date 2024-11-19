import type { DefaultResponse } from '@/models/default-response.model'
import type { Dictionary } from '@/models/dictionary.model'
import type { IRequestBody } from './i-request-body.model'

export interface IRequestModel {
  tags: string[]
  summary: string
  responses: Dictionary<DefaultResponse>
  requestBody: IRequestBody
}
