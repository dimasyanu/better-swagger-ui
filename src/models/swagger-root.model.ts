import type { RestApiRequests } from './rest-api-requests.model'
import { AppInfo } from './app-info.model'
import type { Dictionary } from './dictionary.model'

export class SwaggerRoot {
  public openapi: string = '0.0'
  public info: AppInfo = new AppInfo()
  public paths: Dictionary<RestApiRequests> | null = null

  constructor() {}
}
