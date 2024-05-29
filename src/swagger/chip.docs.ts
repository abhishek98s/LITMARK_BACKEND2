/**
 * @swagger
 * /chip:
 *   get:
 *     tags:
 *       - Chip
 *     security:
 *       - bearerAuth: []
 *     summary: Get all the chips based on user
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Chip'
 *   post:
 *     tags:
 *       - Chip
 *     security:
 *       - bearerAuth: []
 *     summary: Add new chips;
 *     requestBody:
 *       description: Chip Data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Chip'
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Chip'
 * /chip/{id}:
 *   patch:
 *     tags:
 *       - Chip
 *     security:
 *       - bearerAuth: []
 *     summary: Update the chip name by id.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Chip ID
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Chip Data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Chip'
 *   delete:
 *     tags:
 *       - Chip
 *     security:
 *       - bearerAuth: []
 *     summary: Delete the chip by id.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Chip ID
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Chip'
 * components:
 *   schemas:
 *    Chip:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           readOnly: true
 *         name:
 *           type: string
 *         user_id:
 *           type: integer
 *           readOnly: true
 *         folder_id:
 *           type: integer
 *         created_by:
 *           type: string
 *           readOnly: true
 *         updated_by:
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
    '/chip': {
        get: {
            tags: [
                'Chip',
            ],
            security: [
                {
                    bearerAuth: [],
                },
            ],
            summary: 'Get all the chips based on user',
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
                                                    type: 'string',
                                                },
                                                name: {
                                                    type: 'string',
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
            tags: [
                'Chip',
            ],
            security: [
                {
                    bearerAuth: [],
                },
            ],
            summary: 'Add new chips;',
            requestBody: {
                description: 'Chip Data',
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/Chip',
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
                                            name: {
                                                type: 'string',
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
    '/chip/{id}': {
        patch: {
            tags: [
                'Chip',
            ],
            security: [
                {
                    bearerAuth: [],
                },
            ],
            summary: 'Update the chip name by id.',
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    description: 'Chip ID',
                    required: true,
                    schema: {
                        type: 'integer',
                    },
                },
            ],
            requestBody: {
                description: 'Chip Data',
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
            tags: [
                'Chip',
            ],
            security: [
                {
                    bearerAuth: [],
                },
            ],
            summary: 'Delete the chip by id.',
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    description: 'Chip ID',
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
                                            name: {
                                                type: 'string',
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
};

export const schema = {
    Chip: {
        type: 'object',
        properties: {
            id: {
                type: 'integer',
                readOnly: true,
            },
            name: {
                type: 'string',
            },
            user_id: {
                type: 'integer',
                readOnly: true,
            },
            folder_id: {
                type: 'integer',
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
            'name',
            'folder_id',
        ],
        example: {
            name: 'Design',
            folder_id: 1,
        },
    },
};
