
/**
 * @swagger
 * /user:
 *   post:
 *     tags:
 *       - User
 *     summary: Create a new user
 *     description: Create a user
 *     requestBody:
 *       description: User data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *
 * /user/{id}:
 *   get:
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     summary: Get a user by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         description: User ID
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *   patch:
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: User ID
 *         required: true
 *         schema:
 *           type: integer
 *     summary: Update a username and password by user ID
 *     requestBody:
 *       description: User data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *   delete:
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     summary: Delete a user by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         description: User ID
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deleted User Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           readOnly: true
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         image_id:
 *           type: integer
 *         role:
 *           type: string
 *           readOnly: true
 *         updated_by:
 *           type: string
 *           readOnly: true
 *         created_by:
 *           type: string
 *           readOnly: true
 *       required:
 *         - username
 *         - email
 *         - password
 *       example:
 *         username: Examp
 *         email: example@gmail.com
 *         password: Example123!
 */


export const docs = {
    '/user': {
        post: {
            tags: ['User'],
            security: [
                {
                    bearerAuth: [],
                },
            ],
            summary: 'Create a new user',
            requestBody: {
                description: 'User data',
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                username: {
                                    type: 'string',
                                },
                                email: {
                                    type: 'string',
                                },
                                password: {
                                    type: 'string',
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
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    '/user/{id}': {
        get: {
            tags: ['User'],
            security: [
                {
                    bearerAuth: [],
                },
            ],
            summary: 'Get a user by ID',
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    description: 'User ID',
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
                                        type: 'object',
                                        properties: {
                                            id: {
                                                type: 'integer',
                                            },
                                            username: {
                                                type: 'string',
                                            },
                                            email: {
                                                type: 'string',
                                            },
                                            image_id: {
                                                type: 'integer',
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        patch: {
            tags: ['User'],
            security: [
                {
                    bearerAuth: [],
                },
            ],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    description: 'User ID',
                    required: true,
                    schema: {
                        type: 'integer',
                    },
                },
            ],
            summary: 'Update a username and password by user ID',
            requestBody: {
                description: 'User data',
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                username: {
                                    type: 'string',
                                },
                                password: {
                                    type: 'string',
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
                                    data: {
                                        type: 'object',
                                        properties: {
                                            id: {
                                                type: 'integer',
                                            },
                                            username: {
                                                type: 'string',
                                            },
                                            email: {
                                                type: 'string',
                                            },
                                            image_id: {
                                                type: 'integer',
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        delete: {
            tags: ['User'],
            security: [
                {
                    bearerAuth: [],
                },
            ],
            summary: 'Delete a user by ID',
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    description: 'User ID',
                    required: true,
                    schema: {
                        type: 'integer',
                    },
                },
            ],
            responses: {
                '200': {
                    description: 'Deleted User Successfully',
                    content: {
                        'application/json': {
                            schema: {
                                properties: {
                                    status: { type: 'boolean' },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            id: {
                                                type: 'integer',
                                            },
                                            username: {
                                                type: 'string',
                                            },
                                            email: {
                                                type: 'string',
                                            },
                                            image_id: {
                                                type: 'integer',
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
};

export const schema = {
    components: {
        schemas: {
            User: {
                type: 'object',
                properties: {
                    id: {
                        type: 'integer',
                        readOnly: true,
                    },
                    username: {
                        type: 'string',
                    },
                    email: {
                        type: 'string',
                    },
                    password: {
                        type: 'string',
                    },
                    image_id: {
                        type: 'integer',
                    },
                    role: {
                        type: 'string',
                        readOnly: true,
                    },
                    updated_by: {
                        type: 'string',
                        readOnly: true,
                    },
                    created_by: {
                        type: 'string',
                        readOnly: true,
                    },
                },
                required: [
                    'username',
                    'email',
                    'password',
                ],
                example: {
                    username: 'Examp',
                    email: 'example@gmail.com',
                    password: 'Example123!',
                },
            },
        },
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
            },
        },
    },
};
