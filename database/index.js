const mongoose = require("mongoose");
const URL = require("./models/URL");

const connectDb = () => {
  return mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

const models = { URL };

module.exports = { connectDb, models };
