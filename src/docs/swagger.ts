import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocumentation from './swagger_output.json'

export const swagger = function (app: express.Application) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocumentation));
}
