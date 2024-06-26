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
 *     summary: Delete recent bookmark based on the id.
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
 *   patch:
 *     tags:
 *       - RecentBookmark
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
 * /bookmark/recent/sort:
 *   get:
 *     tags:
 *       - RecentBookmark
 *     security:
 *       - bearerAuth: []
 *     summary: Get all recently clicked bookmarks
 *     parameters:
 *       - name: sortBy
 *         in: query
 *         description: Sort type
 *         required: true
 *         schema:
 *           type: string
 *           enum:
 *             - date
 *             - alphabet
 *       - name: order
 *         in: query
 *         description: Order of the result
 *         required: true
 *         schema:
 *           type: string
 *           enum:
 *             - asc
 *             - desc
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Bookmark'
 * /bookmark/recent/search:
 *   get:
 *     tags:
 *       - RecentBookmark
 *     security:
 *       - bearerAuth: []
 *     summary: Search bookmarks based on title
 *     parameters:
 *       - name: title
 *         in: query
 *         description: Titile of bookmark
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Bookmark'
 *
 */
