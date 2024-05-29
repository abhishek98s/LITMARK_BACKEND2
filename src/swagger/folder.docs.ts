/**
 * @swagger
 * /folder:
 *   get:
 *     tags:
 *       - Folder
 *     security:
 *       - bearerAuth: []
 *     summary: Get all the folders related to the user
 *     responses:
 *       200:
 *         description: Successful folder operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Folder'
 *   post:
 *     tags:
 *       - Folder
 *     security:
 *       - bearerAuth: []
 *     summary: Create a new folder
 *     description: Create a folder
 *     requestBody:
 *       description: Folder data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Folder'
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Folder'
 *
 * /folder/{id}:
 *   get:
 *     tags:
 *       - Folder
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Parent_folder_id
 *         required: true
 *         schema:
 *           type: integer
 *     summary: Get all the folders related to the user from a folder_id
 *     responses:
 *       200:
 *         description: Successful folder operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Folder'
 *   patch:
 *     tags:
 *       - Folder
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Folder ID
 *         required: true
 *         schema:
 *           type: integer
 *     summary: Update the folder name
 *     requestBody:
 *       description: Folder Name
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated folder name successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Folder'
 *   delete:
 *     tags:
 *       - Folder
 *     security:
 *       - bearerAuth: []
 *     summary: Delete a folder by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Folder ID
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deleted folder successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Folder'
 * /folder/sort:
 *   get:
 *     tags:
 *       - Folder
 *     security:
 *       - bearerAuth: []
 *     summary: Sort folders by date and alphabet of a folder.
 *     parameters:
 *       - name: sort
 *         in: query
 *         description: Filter type
 *         required: true
 *         schema:
 *           type: string
 *           enum:
 *             - date
 *             - alphabet
 *       - name: folder_id
 *         in: query
 *         description: Folder Id
 *         required: true
 *         schema:
 *           type: integer
 *       - name: order
 *         in: query
 *         description: Folder Id
 *         required: true
 *         schema:
 *           type: string
 *           enum:
 *             - asc
 *             - desc
 *     responses:
 *       200:
 *         description: Deleted folder successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Folder'
 * components:
 *   schemas:
 *     Folder:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           readOnly: true
 *         name:
 *           type: string
 *         image_id:
 *           type: integer
 *         folder_id:
 *           type: integer
 *         updated_by:
 *           type: string
 *           readOnly: true
 *         created_by:
 *           type: string
 *           readOnly: true
 *       required:
 *         - name
 *         - folder_id
 *       example:
 *         name: Design
 *         folder_id: 1
 */

export const docs = {
    '/folder': {
        get: {
            tags: ['Folder'],
            security: [{ bearerAuth: [] }],
            summary: 'Get all the folders related to the user',
            responses: {
                '200': {
                    description: 'Successful folder operation',
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
                                                name: {
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
        post: {
            tags: ['Folder'],
            security: [{ bearerAuth: [] }],
            summary: 'Create a new folder',
            description: 'Create a folder',
            requestBody: {
                description: 'Folder data',
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/Folder' },
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
                                            name: {
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
    '/folder/{id}': {
        get: {
            tags: ['Folder'],
            security: [{ bearerAuth: [] }],
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
            summary: 'Get all the folders related to the user from a folder_id',
            responses: {
                '200': {
                    description: 'Successful folder operation',
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
                                                name: {
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
            tags: ['Folder'],
            security: [{ bearerAuth: [] }],
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
            summary: 'Update the folder name',
            requestBody: {
                description: 'Folder Name',
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                name: {
                                    type: 'string',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                '200': {
                    description: 'Updated folder name successfully',
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
                                            name: {
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
            tags: ['Folder'],
            security: [{ bearerAuth: [] }],
            summary: 'Delete a folder by ID',
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
                '200': {
                    description: 'Deleted folder successfully',
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
                                            name: {
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
    '/folder/sort': {
        get: {
            tags: ['Folder'],
            security: [{ bearerAuth: [] }],
            summary: 'Sort folders by date and alphabet of a folder.',
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
                                                name: {
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
    Folder: {
        type: 'object',
        properties: {
            id: {
                type: 'integer',
                readOnly: true,
            },
            name: {
                type: 'string',
            },
            image_id: {
                type: 'integer',
            },
            folder_id: {
                type: 'integer',
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
        required: ['name', 'folder_id'],
        example: {
            name: 'Design',
            folder_id: 1,
        },
    },
};