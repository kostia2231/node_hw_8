import express from "express";
import sequelize from "./config/db.js";
import "dotenv/config";

const app = express();
app.use(express.json());
const port = process.env.PORT || 9999;

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
