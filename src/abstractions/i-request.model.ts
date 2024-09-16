import type { DefaultResponse } from '@/models/default-response.model'
import type { Dictionary } from '@/models/dictionary.model'

export interface IRequestModel {
  tags: string[]
  summary: string
  responses: Dictionary<DefaultResponse>
}
