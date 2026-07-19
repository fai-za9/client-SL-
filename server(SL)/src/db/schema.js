import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const shoppingTable = sqliteTable("shopping_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  item: text("item").notNull(),
  bought: integer("bought", { mode: "boolean" }).default(false),
});