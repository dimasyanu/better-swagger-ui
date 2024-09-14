import type { DefaultResponse } from "@/models/default-response.model"
import type { Dictionary } from "@/models/dictionary.model"
import type { RequestParameter } from "@/models/request-parameter.model"

export interface IRequestModel {
    tags: string[]
    responses: Dictionary<DefaultResponse>
}
