import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { eq } from "drizzle-orm";
import { db } from "./src/db/index.js";
import { shoppingTable } from "./src/db/schema.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8000;

// Test route
app.get("/", (req, res) => {
  res.send("Shopping List Server is running!");
});

app.get("/items", async (req, res) => {
  const items = await db.select().from(shoppingTable);
  res.json(items);
});
app.post("/items", async (req, res) => {
  const { item } = req.body;

  const newItem = await db
    .insert(shoppingTable)
    .values({
      item,
      bought: false,
    })
    .returning();

  res.status(201).json(newItem);
});
app.put("/items/:id", async (req, res) => {
  const { id } = req.params;
  const { bought } = req.body;

  const updatedItem = await db
    .update(shoppingTable)
    .set({ bought })
    .where(eq(shoppingTable.id, Number(id)))
    .returning();

  res.json(updatedItem[0]);
});
app.delete("/items/:id", async (req, res) => {
  const { id } = req.params;

  await db.delete(shoppingTable).where(eq(shoppingTable.id, Number(id)));

  res.json({
    message: "Item deleted successfully",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
