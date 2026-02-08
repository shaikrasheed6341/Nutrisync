/**
 * @swagger
 * tags:
 *   name: Diet Plans
 *   description: API for managing diet plans and meal items
 */

/**
 * @swagger
 * /v1/api/createplan:
 *   post:
 *     summary: Create a new diet plan with optional meal items
 *     tags: [Diet Plans]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Muscle Gain Plan"
 *               description:
 *                 type: string
 *                 example: "High protein diet for muscle building"
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     day:
 *                       type: string
 *                       enum: [Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday]
 *                       example: "Monday"
 *                     meal:
 *                       type: string
 *                       example: "Breakfast"
 *                     food_code:
 *                       type: string
 *                       example: "1001"
 *                     quantity:
 *                       type: number
 *                       example: 2
 *                     reminder_time:
 *                       type: string
 *                       format: time
 *                       example: "08:00:00"
 *                     is_reminder_enabled:
 *                       type: boolean
 *                       example: true
 *     responses:
 *       201:
 *         description: Diet plan created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Diet plan created successfully"
 *                 plan:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     days:
 *                       type: array
 *                     items:
 *                       type: array
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /v1/api/{diet_plan_id}/add-meal:
 *   post:
 *     summary: Add a single meal item to an existing diet plan
 *     tags: [Diet Plans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: diet_plan_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the diet plan
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - day
 *               - meal
 *               - food_code
 *             properties:
 *               day:
 *                 type: string
 *                 enum: [Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday]
 *                 example: "Tuesday"
 *               meal:
 *                 type: string
 *                 example: "Lunch"
 *               food_code:
 *                 type: string
 *                 example: "1002"
 *               quantity:
 *                 type: number
 *                 default: 1
 *                 example: 1.5
 *               reminder_time:
 *                 type: string
 *                 format: time
 *                 example: "13:30:00"
 *               is_reminder_enabled:
 *                 type: boolean
 *                 default: false
 *     responses:
 *       201:
 *         description: Meal item added successfully
 *       404:
 *         description: Diet plan or food item not found
 */

/**
 * @swagger
 * /v1/api/{diet_plan_id}:
 *   get:
 *     summary: Get a diet plan by ID (optionally filtered by day)
 *     tags: [Diet Plans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: diet_plan_id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: day
 *         schema:
 *           type: string
 *           enum: [Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday]
 *         description: Filter items by day (case insensitive)
 *     responses:
 *       200:
 *         description: Diet plan details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 plan:
 *                   type: object
 *                 schedule:
 *                   type: object
 *                   description: Items grouped by day
 *                   example:
 *                     day1:
 *                       - id: "..."
 *                         meal: "Breakfast"
 *                         food_name: "Oatmeal"
 *       404:
 *         description: Diet plan not found
 */

/**
 * @swagger
 * /v1/api/{diet_plan_id}/items/{item_id}:
 *   put:
 *     summary: Update a meal item
 *     tags: [Diet Plans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: diet_plan_id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: item_id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               day:
 *                 type: string
 *                 description: Provide to move item to a different day
 *                 example: "Wednesday"
 *               meal:
 *                 type: string
 *                 example: "Post-Workout"
 *               food_code:
 *                 type: string
 *                 example: "1005"
 *               quantity:
 *                 type: number
 *                 example: 3
 *               reminder_time:
 *                 type: string
 *                 format: time
 *               is_reminder_enabled:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Meal item updated successfully
 *       404:
 *         description: Item not found
 */

/**
 * @swagger
 * /v1/api/{diet_plan_id}:
 *   put:
 *     summary: Update diet plan details (name, description, status)
 *     tags: [Diet Plans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: diet_plan_id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Diet plan updated successfully
 */
