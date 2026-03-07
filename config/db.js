const mongoose = require("mongoose");

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    const msg = "MONGO_URI is not defined in environment";
    console.error(msg);
    // throw so caller can decide what to do (tests may override)
    throw new Error(msg);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Error:", error.message);
    // rethrow so that startup code can handle it
    throw error;
  }
};

module.exports = connectDB;