/**
 * @swagger
 * /image:
 *   post:
 *     tags:
 *       - Image
 *     security:
 *       - bearerAuth: []
 *     summary: Create a new image
 *     description: Create an image
 *     requestBody:
 *       description: Image Data
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/Image'
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Image'
 * /image/{id}:
 *   get:
 *     tags:
 *       - Image
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: User ID
 *         required: true
 *         schema:
 *           type: integer
 *     summary: Get the image by id
 *     responses:
 *       '200':
 *         description: Sucessful Image operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Image'
 *   patch:
 *     tags:
 *       - Image
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               litmark_image:
 *                 type: string
 *                 format: binary
 *               name:
 *                 type: string
 *             required:
 *               - name
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *   delete:
 *     tags:
 *       - Image
 *     security:
 *       - bearerAuth: []
 *     summary: Delete a image by id
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Folder ID
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Deleted Image Sucessfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Image'
 * 
 * components:
 *   schemas:
 *     Image:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           readOnly: true
 *         name:
 *           type: string
 *           readOnly: true
 *         url:
 *           type: string
 *           readOnly: true
 *         type:
 *           type: string
 *           enum:
 *             - user
 *             - folder
 *             - Bookmark
 *         litmark_image:
 *           type: string
 *           format: binary
 *         created_by:
 *           type: string
 *           readOnly: true
 *         updated_by:
 *           type: string
 *           readOnly: true
 *       required:
 *         - litmark_image
 *         - type
 *       example:
 *         type: user or Bookmark or folder
 */


export const docs = {
    '/image': {
        post: {
            tags: [
                'Image',
            ],
            security: [
                {
                    bearerAuth: [],
                },
            ],
            summary: 'Create a new image',
            description: 'Create an image',
            requestBody: {
                description: 'Image Data',
                required: true,
                content: {
                    'multipart/form-data': {
                        schema: {
                            $ref: '#/components/schemas/Image',
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Successful operation',
                    content: {
                        'application/json': {
                            schema: {
                                properties: {
                                    status: {
                                        type: 'boolean',
                                    },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            id: {
                                                type: 'string',
                                            },
                                            name: {
                                                type: 'string',
                                            },
                                            url: {
                                                type: 'string',
                                            },
                                            type: {
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
        },
    },
    '/image/{id}': {
        get: {
            tags: [
                'Image',
            ],
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
            summary: 'Get the image by id',
            responses: {
                200: {
                    description: 'Sucessful Image operation',
                    content: {
                        'application/json': {
                            schema: {
                                properties: {
                                    status: {
                                        type: 'boolean',
                                    },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            id: {
                                                type: 'string',
                                            },
                                            name: {
                                                type: 'string',
                                            },
                                            url: {
                                                type: 'string',
                                            },
                                            type: {
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
        },
        patch: {
            tags: [
                'Image',
            ],
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
                    'multipart/form-data': {
                        schema: {
                            type: 'object',
                            properties: {
                                litmark_image: {
                                    type: 'string',
                                    format: 'binary',
                                },
                                name: {
                                    type: 'string',
                                },
                            },
                            required: [
                                'name',
                            ],
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Successful operation',
                    content: {
                        'application/json': {
                            schema: {
                                properties: {
                                    status: {
                                        type: 'boolean',
                                    },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            id: {
                                                type: 'string',
                                            },
                                            name: {
                                                type: 'string',
                                            },
                                            url: {
                                                type: 'string',
                                            },
                                            type: {
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
        },
        delete: {
            tags: [
                'Image',
            ],
            security: [
                {
                    bearerAuth: [],
                },
            ],
            summary: 'Delete a image by id',
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    description: 'Folder ID',
                    required: true,
                    schema: {
                        type: 'integer',
                    },
                },
            ],
            responses: {
                200: {
                    description: 'Deleted Image Sucessfully',
                    content: {
                        'application/json': {
                            schema: {
                                properties: {
                                    status: {
                                        type: 'boolean',
                                    },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            id: {
                                                type: 'string',
                                            },
                                            name: {
                                                type: 'string',
                                            },
                                            url: {
                                                type: 'string',
                                            },
                                            type: {
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
        },
    },
};

export const schema = {
    Image: {
        type: 'object',
        properties: {
            id: {
                type: 'integer',
                readOnly: true,
            },
            name: {
                type: 'string',
                readOnly: true,
            },
            url: {
                type: 'string',
                readOnly: true,
            },
            type: {
                type: 'string',
                enum: [
                    'user',
                    'folder',
                    'Bookmark',
                ],
            },
            litmark_image: {
                type: 'string',
                format: 'binary',
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
        required: [
            'litmark_image',
            'type',
        ],
        example: {
            type: 'user' || 'Bookmark' || 'folder',
        },
    },
};
