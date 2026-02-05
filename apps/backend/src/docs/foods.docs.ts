/**
 * @openapi
 * /v1/api/getallfoods:
 *   get:
 *     tags:
 *       - Foods
 *     summary: Get all foods
 *     responses:
 *       200:
 *         description: A list of foods
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Food'
 */

/**
 * @openapi
 * /v1/api/getfoodbyname/{food_name}:
 *   post:
 *     tags:
 *       - Foods
 *     summary: Get a food by name
 *     parameters:
 *       - name: food_name
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A food object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Food'
 */ 