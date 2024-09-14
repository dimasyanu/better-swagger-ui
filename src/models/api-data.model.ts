import type { IRequestModel } from "@/abstractions/i-request.model";

export class ApiData {
    constructor(
        public tag: string,
        public endpoints: ApiEndpoint[]
    ){}
}

export class ApiEndpoint {
    constructor(
        public path: string,
        public request: IRequestModel
    ){}
}