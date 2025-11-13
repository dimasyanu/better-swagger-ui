export class SwaggerSchemaProperty {
  constructor(
    public name: String = '',
    public nullable: boolean = true,
    public type: string = 'string',
    public format: string | undefined,
    public $ref: string | undefined = undefined,
    public items: SwaggerSchemaProperty | undefined = undefined
  ) {}

  public get schemaType(): string {
    if (this.$ref) {
      const parts = this.$ref.split('/')
      const lastPart = parts[parts.length - 1]
      if (!lastPart) return this.type
      return lastPart
    }
    return this.type
  }

  public getSchemaType(): string {
    if (this.$ref) {
      const parts = this.$ref.split('/')
      const lastPart = parts[parts.length - 1]
      if (!lastPart) return this.type
      return lastPart
    }
    return this.type
  }
}
