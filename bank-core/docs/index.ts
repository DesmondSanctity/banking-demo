import swaggerJsdoc from 'swagger-jsdoc';
import { baseURL } from '../src/config/app.config.js';

const swaggerOptions = {
 definition: {
  openapi: '3.0.0',
  info: {
   title: 'Banking Demo API',
   version: '1.0.0',
   description: 'API documentation for the Banking Demo application',
  },
  servers: [
   {
    url: `{baseURL}`,
   },
  ],
  components: {
   securitySchemes: {
    BearerAuth: {
     type: 'http',
     scheme: 'bearer',
     bearerFormat: 'JWT',
    },
   },
  },
  security: [
   {
    BearerAuth: [],
   },
  ],
 },
 apis: ['./bank-core/docs/specs/*.yml'], // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export default swaggerSpec;
