import type { DefaultResponse } from "./default-response.model";
import type { Dictionary } from "./dictionary.model";
import type { RequestParameter } from "./request-parameter.model";

export class GetRequest {
  constructor(
    public tags: string[] = [],
    public parameters: RequestParameter[] = [],
    public responses: Dictionary<DefaultResponse>
  ){ }
}
