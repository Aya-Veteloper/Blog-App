const mongoose = require("mongoose");

module.exports = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`connect to MongoDB`);
  } catch (err) {
    console.log(`Connection failed due to ${err}`);
  }
};
