
/**
 * @openapi
 * /v1/api/user:
 *   post:
 *     tags:
 *       - User
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User registered successfully
 *       404:
 *         description: Missing fields or user already exists
 */

/**
 * @openapi
 * /v1/api/login:
 *   post:
 *     tags:
 *       - User
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *       404:
 *         description: User not found or invalid password
 */

/**
 * @openapi
 * /v1/api/details:
 *   post:
 *     tags:
 *       - User
 *     summary: Insert user personal details
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - age
 *               - gender
 *               - height
 *               - weight
 *               - activitylevel
 *               - diettype
 *               - goal
 *               - bodytype
 *               - medicalissues
 *               - country
 *             properties:
 *               name:
 *                 type: string
 *               age:
 *                 type: integer
 *               gender:
 *                 type: string
 *               height:
 *                 type: number
 *               weight:
 *                 type: number
 *               activitylevel:
 *                 type: string
 *               diettype:
 *                 type: string
 *               goal:
 *                 type: string
 *               bodytype:
 *                 type: string
 *               medicalissues:
 *                 type: string
 *               country:
 *                 type: string
 *     responses:
 *       200:
 *         description: User personal details inserted successfully
 *       404:
 *         description: Missing fields
 */

/**
 * @openapi
 * /v1/api/details:
 *   get:
 *     tags:
 *       - User
 *     summary: Get user personal details
 *     responses:
 *       200:
 *         description: User personal details fetched successfully
 *       404:
 *         description: User not found
 */

/**
 * @openapi
 * /v1/api/details:
 *   put:
 *     tags:
 *       - User
 *     summary: Update user personal details
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - age
 *               - gender
 *               - height
 *               - weight
 *               - activitylevel
 *               - diettype
 *               - goal
 *               - bodytype
 *               - medicalissues
 *               - country
 *             properties:
 *               name:
 *                 type: string
 *               age:
 *                 type: integer
 *               gender:
 *                 type: string
 *               height:
 *                 type: number
 *               weight:
 *                 type: number
 *               activitylevel:
 *                 type: string
 *               diettype:
 *                 type: string
 *               goal:
 *                 type: string
 *               bodytype:
 *                 type: string
 *               medicalissues:
 *                 type: string
 *               country:
 *                 type: string
 *     responses:
 *       200:
 *         description: User personal details updated successfully
 *       404:
 *         description: User not found or missing fields
 */
