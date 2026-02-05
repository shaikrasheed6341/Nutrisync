import { real, integer, timestamp, boolean, time } from "drizzle-orm/pg-core";
import { pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    username: text("username").notNull(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    usertype: text("usertype").notNull().default("user"),
    image: text("image"),
});
export const userpersonaldata = pgTable("userpersonaldata", {
    id: uuid("id").primaryKey(),
    country: text("country").notNull(), 
    age: integer("age").notNull(),
    height: real("height").notNull(),
    weight: real("weight").notNull(),
    gender: text("gender").notNull(),
    bodytype: text("bodytype").notNull(),
    documentimage: text("documentimage"),
    medicalissues: text("medicalissues").notNull(),
    foodcategory: text("foodcategory"),
    usergoal: text("usergoal").notNull(),
    user_id: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" })

})

export const foods = pgTable("foods", {
    food_code: text("food_code").primaryKey(),
    food_name: text("food_name").notNull(),
    primarysource: text("primarysource"),
    energy_kj: real("energy_kj"),
    energy_kcal: real("energy_kcal"),
    carb_g: real("carb_g"),
    protein_g: real("protein_g"),
    fat_g: real("fat_g"),
    image: text("image"),
});

export const dayOfWeekEnum = pgEnum("day_of_week", [
    "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"
]);

export const mealTypeEnum = pgEnum("meal_type", [
    "meal_1", "meal_2", "meal_3", "meal_4", "meal_5", "meal_6", "meal_7", "meal_8", "meal_9", "meal_10"
]);

export const dietPlans = pgTable("diet_plans", {
    id: uuid("id").defaultRandom().primaryKey(),
    user_id: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    isActive: boolean("is_active").default(false),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
});

export const dietPlanItems = pgTable("diet_plan_items", {
    id: uuid("id").defaultRandom().primaryKey(),
    diet_plan_id: uuid("diet_plan_id").notNull().references(() => dietPlans.id, { onDelete: "cascade" }),
    food_code: text("food_code").notNull().references(() => foods.food_code, { onDelete: "cascade" }),
    day: dayOfWeekEnum("day").notNull(),
    meal: mealTypeEnum("meal").notNull().default("meal_1"),
    quantity: real("quantity").default(1).notNull(),
    reminder_time: time("reminder_time"),
    is_reminder_enabled: boolean("is_reminder_enabled").default(false),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
});



export const usertype = pgEnum("usertype", ["user", "admin", "nutritionist"])
export const usergoal = pgEnum("usergoal", ["loseweight", "gainweight", "maintainweight"])
export const gender = pgEnum("gender", ["male", "female", "other"])
export const bodytype = pgEnum("bodytype", ["lean", "athletic", "overweight", "obese"])
export const foodcategory = pgEnum("foodcategory", ["veg", "nonveg", "vegan", "pescatarian", "vegetarian", "all_food"])
export const country = pgEnum("country", ["india", "usa", "uk", "canada", "australia", "newzealand", "southafrica", "uae", "oman", "qatar", "bahrain", "kuwait", "saudiarabia", "malaysia", "singapore", "hongkong", "philippines", "indonesia", "thailand", "vietnam", "myanmar", "cambodia", "laos", "brunei", "timorleste", "pakistan", "bangladesh", "srilanka", "nepal", "bhutan", "maldives", "afghanistan", "iran", "iraq", "syria", "lebanon", "jordan", "palestine", "yemen"])