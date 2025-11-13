export class SwaggerSchemaProperty {
  constructor(
    public name: String = '',
    public nullable: boolean = true,
    public type: string = 'string',
    public format: string | undefined
  ) {}
}
