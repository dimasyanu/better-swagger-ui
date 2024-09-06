export interface SwaggerSecurityScheme extends ISwaggerSecurityScheme {}

export interface ISwaggerSecurityScheme {
  description: string
  in: string
  name: string
  type: string
}
