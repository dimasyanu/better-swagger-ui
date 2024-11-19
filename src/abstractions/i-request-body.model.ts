import type { IRequestBodySchema } from "./i-request-body-schema.model";

export interface IRequestBody {
    content: {[name: string]: {schema: IRequestBodySchema}}[]
}