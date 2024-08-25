import type { RestApiRequests } from "./rest-api-requests.model";
import { AppInfo } from "./app-info.model";
import type { Dictionary } from "./dictionary.model";

export class SwaggerRoot {
  constructor(
    openapi: string = '0.0',
    info: AppInfo = new AppInfo,
    paths: Dictionary<RestApiRequests>
  ){}
}