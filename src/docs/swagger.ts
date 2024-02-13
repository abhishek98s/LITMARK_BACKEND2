import swaggerJSDoc from 'swagger-jsdoc'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Your API Title',
      version: '1.0.0',
      description: 'API documentation for your Node.js application',
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
      },
    ],
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [`${__dirname}/../**/*.ts`], // Path to the API routes
};
export const swaggerSpec = swaggerJSDoc(options);
