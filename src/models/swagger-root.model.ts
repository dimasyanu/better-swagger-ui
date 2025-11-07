import type { RestApiRequests } from './rest-api-requests.model'
import { SwaggerAppInfo } from './swagger-app-info.model'
import type { Dictionary } from './dictionary.model'
import { SwaggerComponents } from './swagger-components.model'

export class SwaggerRoot {
  public components: SwaggerComponents = new SwaggerComponents()
  public openapi: string = '0.0'
  public info: SwaggerAppInfo = new SwaggerAppInfo()
  public paths: { [path: string]: RestApiRequests } | null = null

  constructor() { }
}
