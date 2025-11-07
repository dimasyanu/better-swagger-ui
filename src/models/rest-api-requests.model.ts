import type { GetRequest } from './get-request.model'
import type { PostRequest } from './post-request.model'

export class RestApiRequests {
  public post: PostRequest | null = null
  public patch: PostRequest | null = null
  public put: PostRequest | null = null
  public get: GetRequest | null = null
  public delete: GetRequest | null = null
  constructor() { }
}
