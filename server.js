const express = require("express");
const router = require("./controllers");
const db = require("./config/connection");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", router);

db.once("open", () => {
  console.log(`Database connected at ${db.host}:${db.port}`);
});

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});