import { real, integer } from "drizzle-orm/pg-core";
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

export const usertype = pgEnum("usertype", ["user", "admin", "nutritionist"])
export const usergoal = pgEnum("usergoal", ["loseweight", "gainweight", "maintainweight"])
export const gender = pgEnum("gender", ["male", "female", "other"])
export const bodytype = pgEnum("bodytype", ["lean", "athletic", "overweight", "obese"])
export const foodcategory = pgEnum("foodcategory", ["veg", "nonveg", "vegan", "pescatarian", "vegetarian"])
