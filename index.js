import express from "express";
import sequelize from "./config/db.js";
import { Book } from "./models/book.js";
import "dotenv/config";

const app = express();
app.use(express.json());

const port = process.env.PORT || 9999;

app.get("/books", async (_req, res) => {
  try {
    const books = await Book.findAll();
    res.json(books);
  } catch (error) {
    if (error) {
      res.status(500).json({ error: error.message });
      console.error(`error occurred getting items: ${error}`);
    }
  }
});

app.post("/books", async (req, res) => {
  try {
    const { title, author, year } = req.body;
    const book = await Book.create({ title, author, year });
    res.status(201).json(book);
  } catch (error) {
    if (error) {
      res.status(400).json({ error: error.message });
      console.error(`error occurred creating item: ${error}`);
    }
  }
});

app.put("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, year } = req.body;
    const [updated] = await Book.update(
      { title, author, year },
      { where: { id } }
    );

    if (updated) {
      const updateBook = await Book.findByPk(id);
      res.json(updateBook);
    } else {
      res.status(404).json({ error: "book not found" });
    }
  } catch (error) {
    if (error) {
      res.status(400).json({ error: error.message });
    }
  }
});

app.delete("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Book.destroy({ where: { id } });

    if (deleted) {
      res.status(200).send(`book with id: ${id} was deleted successfully`);
    } else {
      res.status(404).json({ error: "book not found" });
    }
  } catch (error) {
    if (error) {
      res.status(500).json({ error: error.message });
      console.error(`error occurred when deleting an item: ${error}`);
    }
  }
});

app.listen(port, async () => {
  try {
    await sequelize.authenticate();
    console.log("database connected");
    console.log(`server is running on port: ${port}`);
  } catch (error) {
    if (error) {
      console.error(`unable to connect, error: ${error}`);
    }
  }
});
