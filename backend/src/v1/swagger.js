const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Kanban Board API',
      version: '1.0.0',
      description: 'API documentation for the Kanban Board application',
    },
    servers: [
      {
        url: 'http://localhost:3001/api/v1'|| 'https://kannybunny.onrender.com',

      },
    ],
    components: {
      schemas: {
        Board: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              description: 'Board title',
            },
            description: {
              type: 'string',
              description: 'Board description',
            },
          },
          required: ['title'],
        },
        List: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              description: 'List title',
            },
            boardId: {
              type: 'string',
              description: 'ID of the parent board',
            },
            position: {
              type: 'number',
              description: 'Position in the board',
            },
          },
          required: ['title', 'boardId'],
        },
        Task: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              description: 'Task title',
            },
            description: {
              type: 'string',
              description: 'Task description',
            },
            listId: {
              type: 'string',
              description: 'ID of the parent list',
            },
            position: {
              type: 'number',
              description: 'Position in the list',
            },
            priority: {
              type: 'string',
              enum: ['low', 'medium', 'high'],
              description: 'Task priority',
            },
          },
          required: ['title', 'listId'],
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/v1/routes/*.js'], // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
