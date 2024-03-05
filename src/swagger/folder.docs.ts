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
 *         - image_id
 *         - folder_id
 *       example:
 *         name: Design
 *         image_id: 0
 *         folder_id: 1
 */
