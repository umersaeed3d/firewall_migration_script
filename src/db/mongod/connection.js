const mongoose = require("mongoose");
require('dotenv').config()
const PORT = process.env.MONGODB_PORT;
const db_name = process.env.DB_NAME;
mongoose.connect(`mongodb://localhost:${PORT}/${db_name}`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

module.exports = db.collection('mappings');