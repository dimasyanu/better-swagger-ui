export class SwaggerSchemaProperty {
  constructor(
    public nullable: boolean = true,
    public type: string = 'string',
    public format: string | undefined
  ) {}
}
