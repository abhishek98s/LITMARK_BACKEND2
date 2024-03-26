/**
 * @swagger
 * /bookmark/recent:
 *   get:
 *     tags:
 *       - RecentBookmark
 *     security:
 *       - bearerAuth: []
 *     summary: Get all recently clicked bookmarks
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Bookmark'
 * /bookmark/recent/{id}:
 *   delete:
 *     tags:
 *       - RecentBookmark
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Bookmark ID whose click_date is not null
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
 */
