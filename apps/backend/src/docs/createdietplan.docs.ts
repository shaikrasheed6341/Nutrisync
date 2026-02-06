
/**
* @openapi 
* /v1/api/createplan:
*   post:
*     tags:
*       - Diet Plan
*     security:
*       - bearerAuth: []
*     summary: Create a new diet plan
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
*               description:
*                 type: string
*     responses:
*       200:
*         description: Diet plan created successfully
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                 plan:
*                   type: object
*                   properties:
*                     id:
*                       type: string
*                     name:
*                       type: string
*                     description:
*                       type: string
*       404:
*         description: User not found or invalid password
*/


/**
 @openapi 
 /v1/api/createplan/{diet_plan_id}/add-meal:
   post:
     tags:
       - Diet Plan
     security:
       - bearerAuth: []
     summary: Add a meal to the diet plan
     parameters:
       - in: path
         name: diet_plan_id
         required: true
         description: ID of the diet plan
         schema:
           type: string
     requestBody:
       required: true
       content:
         application/json:
           schema:
             type: object
             required:
               - food_code
               - day
               - meal
               - quantity
               - reminder_time
               - is_reminder_enabled
             properties:
               food_code:
                 type: string
               day:
                 type: string
                 enum: [monday, tuesday, wednesday, thursday, friday, saturday, sunday]
               meal:
                 type: string
                 enum: [meal_1, meal_2, meal_3, meal_4, meal_5, meal_6, meal_7, meal_8, meal_9, meal_10]
               quantity:
                 type: number
               reminder_time:
                 type: string
               is_reminder_enabled:
                 type: boolean
     responses:
       200:
         description: Meal added successfully
         content:
           application/json:
             schema:
               type: object
               properties:
                 message:
                   type: string
                 item:
                   type: object
                   properties:
                     id:
                       type: string
                     diet_plan_id:
                       type: string
                     food_code:
                       type: string
                     day:
                       type: string
                     meal:
                       type: string
                     quantity:
                       type: number
                     reminder_time:
                       type: string
                     is_reminder_enabled:
                       type: boolean
       404:
         description: Diet plan not found or access denied
*/
