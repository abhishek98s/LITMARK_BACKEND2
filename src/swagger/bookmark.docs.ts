/**
 * @swagger
 * /bookmark:
 *   get:
 *     tags:
 *       - Bookmark
 *     security:
 *       - bearerAuth: []
 *     summary: Get all the bookmarks based on user
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Bookmark'
 *   post:
 *     tags:
 *       - Bookmark
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Bookmark Data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Bookmark'
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bookmark'
 * /bookmark/{id}:
 *   get:
 *     tags:
 *       - Bookmark
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Parent_folder_id
 *         required: true
 *         schema:
 *           type: integer
 *     summary: Get all the bookmarks based on user by folder_id
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Bookmark'
 *   patch:
 *     tags:
 *       - Bookmark
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Bookmark ID
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Bookmark Data
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
 *               $ref: '#/components/schemas/Bookmark'
 *   delete:
 *     tags:
 *       - Bookmark
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Bookmark ID
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bookmark'
 * /bookmark/click/{id}:
 *   patch:
 *     tags:
 *       - Bookmark
 *     security:
 *       - bearerAuth: []
 *     summary: Update the date of when bookmark was clicked by bookmark id
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Bookmark ID
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bookmark'
 * components:
 *   schemas:
 *    Bookmark:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           readOnly: true
 *         title:
 *           type: string
 *         date:
 *           type: date
 *         image_id:
 *           type: number
 *           readOnly: true
 *         user_id:
 *           type: number
 *         folder_id:
 *           type: integer
 *         chip_id:
 *           type: number
 *         created_by:
 *           type: string
 *           readOnly: true
 *         updated_by:
 *           type: string
 *           readOnly: true
 *       required:
 *         - title
 *         - folder_id
 *         - chip_id
 *       example:
 *         title: React in Dept
 *         folder_id: 2
 *         chip_id: 1
 */
