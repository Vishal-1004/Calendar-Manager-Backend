const mongoose = require("mongoose");

const DB = process.env.DATABASE;

// code to connect with our mongodb database
mongoose
  .connect(DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log("MongoDB Database Connected"))
  .catch((error) => {
    console.log("error", error);
  });
