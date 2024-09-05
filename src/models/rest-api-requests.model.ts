import type { GetRequest } from './get-request.model'
import type { PostRequest } from './post-request.model'

export class RestApiRequests {
  public post: PostRequest | null = null
  public get: GetRequest | null = null
  constructor() {}
}
