require("dotenv").config();
require("./db/connection.js");
const router = require("./routers/router.js");

const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

// middlewares
app.use(router);

// port where our backend server will be running
const PORT = process.env.PORT || 4004;

app.listen(PORT, () => {
  console.log(`Server start at Port No : http://localhost:${PORT}`);
});
