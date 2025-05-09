import { responseSchema } from './response';

export const docs = {
  '/bookmark': {
    get: {
      tags: ['Bookmark'],
      security: [
        {
          bearerAuth: [],
        },
      ],
      summary: 'Get all the bookmarks based on user',
      responses: {
        '200': {
          description: 'Successful operation',
          content: {
            'application/json': {
              schema: {
                properties: {
                  status: { type: 'boolean' },
                  data: {
                    type: 'array',
                    items: {
                      properties: {
                        id: {
                          type: 'integer',
                        },
                        url: {
                          type: 'string',
                        },
                        image_id: {
                          type: 'integer',
                        },
                        user_id: {
                          type: 'integer',
                        },
                        folder_id: {
                          type: 'integer',
                        },
                        chip_id: {
                          type: 'integer',
                        },
                        title: {
                          type: 'string',
                        },
                        date: {
                          type: 'string',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        '401': { ...responseSchema.UNAUTHORIZED },
        '403': { ...responseSchema.FORBIDDEN },
        '500': { ...responseSchema.INTERNAL_SERVER_ERROR },
      },
    },
    post: {
      tags: ['Bookmark'],
      security: [
        {
          bearerAuth: [],
        },
      ],
      summary: 'Add new bookmark.',
      requestBody: {
        description: 'Bookmark Data',
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                url: {
                  type: 'string',
                },
                folder_id: {
                  type: 'integer',
                },
              },
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Successful operation',
          content: {
            'application/json': {
              schema: {
                properties: {
                  status: {
                    type: 'boolean',
                  },
                  message: {
                    type: 'string',
                  },
                  date: {
                    type: 'object',
                    properties: {
                      id: {
                        type: 'string',
                      },
                      url: {
                        type: 'string',
                      },
                      image_id: {
                        type: 'integer',
                      },
                      user_id: {
                        type: 'integer',
                      },
                      folder_id: {
                        type: 'integer',
                      },
                      chip_id: {
                        type: 'integer',
                      },
                      title: {
                        type: 'string',
                      },
                      date: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
            },
          },
        },
        '400': { ...responseSchema.BAD_REQUEST },
        '401': { ...responseSchema.UNAUTHORIZED },
        '403': { ...responseSchema.FORBIDDEN },
        '422': { ...responseSchema.UNPROCESSABLE_ENTITY },
        '500': { ...responseSchema.INTERNAL_SERVER_ERROR },
      },
    },
  },
  '/bookmark/{id}': {
    get: {
      tags: ['Bookmark'],
      security: [
        {
          bearerAuth: [],
        },
      ],
      summary: 'Get all the bookmarks based on user by folder_id',
      parameters: [
        {
          name: 'id',
          in: 'path',
          description: 'Parent_folder_id',
          required: true,
          schema: {
            type: 'integer',
          },
        },
      ],
      responses: {
        '200': {
          description: 'Successful operation',
          content: {
            'application/json': {
              schema: {
                properties: {
                  status: { type: 'boolean' },
                  data: {
                    type: 'array',
                    items: {
                      properties: {
                        id: {
                          type: 'integer',
                        },
                        url: {
                          type: 'string',
                        },
                        image_id: {
                          type: 'integer',
                        },
                        user_id: {
                          type: 'integer',
                        },
                        folder_id: {
                          type: 'integer',
                        },
                        chip_id: {
                          type: 'integer',
                        },
                        title: {
                          type: 'string',
                        },
                        date: {
                          type: 'string',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        '400': { ...responseSchema.BAD_REQUEST },
        '401': { ...responseSchema.UNAUTHORIZED },
        '403': { ...responseSchema.FORBIDDEN },
        '404': { ...responseSchema.NOT_FOUND },
      },
    },
    patch: {
      tags: ['Bookmark'],
      security: [
        {
          bearerAuth: [],
        },
      ],
      summary: 'Update bookmark name based of ceratin id.',
      parameters: [
        {
          name: 'id',
          in: 'path',
          description: 'Bookmark ID',
          required: true,
          schema: {
            type: 'integer',
          },
        },
      ],
      requestBody: {
        description: 'Bookmark Data',
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                title: {
                  type: 'string',
                },
                folder_id: {
                  type: 'integer',
                },
              },
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Successful operation',
          content: {
            'application/json': {
              schema: {
                properties: {
                  status: { type: 'boolean' },
                  message: { type: 'string' },
                  data: {
                    type: 'object',
                    properties: {
                      id: {
                        type: 'string',
                      },
                      url: {
                        type: 'string',
                      },
                      image_id: {
                        type: 'integer',
                      },
                      user_id: {
                        type: 'integer',
                      },
                      folder_id: {
                        type: 'integer',
                      },
                      chip_id: {
                        type: 'integer',
                      },
                      title: {
                        type: 'string',
                      },
                      date: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
            },
          },
        },
        '400': { ...responseSchema.BAD_REQUEST },
        '401': { ...responseSchema.UNAUTHORIZED },
        '403': { ...responseSchema.FORBIDDEN },
        '404': { ...responseSchema.NOT_FOUND },
        '409': { ...responseSchema.CONFLICT },
        '422': { ...responseSchema.UNPROCESSABLE_ENTITY },
        '500': { ...responseSchema.INTERNAL_SERVER_ERROR },
      },
    },
    delete: {
      tags: ['Bookmark'],
      security: [
        {
          bearerAuth: [],
        },
      ],
      summary: 'Delete a bookmark by id',
      parameters: [
        {
          name: 'id',
          in: 'path',
          description: 'Bookmark ID',
          required: true,
          schema: {
            type: 'integer',
          },
        },
      ],
      responses: {
        '200': {
          description: 'Successful operation',
          content: {
            'application/json': {
              schema: {
                properties: {
                  status: { type: 'boolean' },
                  message: { type: 'string' },
                  data: {
                    type: 'object',
                    properties: {
                      id: {
                        type: 'string',
                      },
                      url: {
                        type: 'string',
                      },
                      image_id: {
                        type: 'integer',
                      },
                      user_id: {
                        type: 'integer',
                      },
                      folder_id: {
                        type: 'integer',
                      },
                      chip_id: {
                        type: 'integer',
                      },
                      title: {
                        type: 'string',
                      },
                      date: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
            },
          },
        },
        '400': { ...responseSchema.BAD_REQUEST },
        '401': { ...responseSchema.UNAUTHORIZED },
        '403': { ...responseSchema.FORBIDDEN },
        '404': { ...responseSchema.NOT_FOUND },
        '409': { ...responseSchema.CONFLICT },
      },
    },
  },
  '/bookmark/sort': {
    get: {
      tags: ['Bookmark'],
      security: [
        {
          bearerAuth: [],
        },
      ],
      summary: 'Sort bookmarks by date and alphabet of a folder.',
      parameters: [
        {
          name: 'sort',
          in: 'query',
          description: 'Filter type',
          required: true,
          schema: {
            type: 'string',
            enum: ['date', 'alphabet'],
          },
        },
        {
          name: 'folder_id',
          in: 'query',
          description: 'Folder Id',
          required: true,
          schema: {
            type: 'integer',
          },
        },
        {
          name: 'order',
          in: 'query',
          description: 'Folder Id',
          required: true,
          schema: {
            type: 'string',
            enum: ['asc', 'desc'],
          },
        },
      ],
      responses: {
        '200': {
          description: 'Deleted folder successfully',
          content: {
            'application/json': {
              schema: {
                properties: {
                  status: { type: 'boolean' },
                  data: {
                    type: 'array',
                    items: {
                      properties: {
                        id: {
                          type: 'integer',
                        },
                        url: {
                          type: 'string',
                        },
                        image_id: {
                          type: 'integer',
                        },
                        user_id: {
                          type: 'integer',
                        },
                        folder_id: {
                          type: 'integer',
                        },
                        chip_id: {
                          type: 'integer',
                        },
                        title: {
                          type: 'string',
                        },
                        date: {
                          type: 'string',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        '400': { ...responseSchema.BAD_REQUEST },
        '401': { ...responseSchema.UNAUTHORIZED },
        '403': { ...responseSchema.FORBIDDEN },
      },
    },
  },
  '/bookmark/search': {
    get: {
      tags: ['Bookmark'],
      security: [
        {
          bearerAuth: [],
        },
      ],
      summary: 'Get all the bookmarks based on user',
      parameters: [
        {
          name: 'title',
          in: 'query',
          description: 'Title of bookmark',
          required: true,
          type: 'string',
        },
        {
          name: 'folder_id',
          in: 'query',
          description: 'Folder_id to search bookmark in certain folder',
          required: true,
          type: 'integer',
        },
      ],
      responses: {
        '200': {
          description: 'Successful operation',
          content: {
            'application/json': {
              schema: {
                properties: {
                  status: { type: 'boolean' },
                  data: {
                    type: 'array',
                    items: {
                      properties: {
                        url: {
                          type: 'string',
                        },
                        title: {
                          type: 'string',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        '401': { ...responseSchema.UNAUTHORIZED },
        '403': { ...responseSchema.FORBIDDEN },
        '422': { ...responseSchema.UNPROCESSABLE_ENTITY },
        '500': { ...responseSchema.INTERNAL_SERVER_ERROR },
      },
    },
  },
};

export const schema = {
  Bookmark: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        readOnly: true,
      },
      title: {
        type: 'string',
      },
      date: {
        type: 'date',
      },
      image_id: {
        type: 'number',
        readOnly: true,
      },
      user_id: {
        type: 'number',
      },
      folder_id: {
        type: 'integer',
      },
      chip_id: {
        type: 'number',
      },
      created_by: {
        type: 'string',
        readOnly: true,
      },
      updated_by: {
        type: 'string',
        readOnly: true,
      },
    },
    required: ['title', 'folder_id', 'chip_id'],
  },
};
