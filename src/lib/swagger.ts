import { createSwaggerSpec } from 'next-swagger-doc'

export async function getApiDocs() {
  const spec = createSwaggerSpec({
    apiFolder: 'src/app/api', // define api folder under app folder
    definition: {
      components: {
        securitySchemes: {
          BearerAuth: {
            bearerFormat: 'JWT',
            scheme: 'bearer',
            type: 'http',
          },
        },
      },
      info: {
        title: 'Next Swagger API Example',
        version: '1.0',
      },
      openapi: '3.0.0',
      security: [],
    },
  })
  return spec
}
