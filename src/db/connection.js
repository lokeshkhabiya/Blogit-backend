const mongoose = require("mongoose");
const dotenv = require("dotenv");

const connect = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("DB connected successfully!");
    } catch (error) {
        console.error("Error while connecting to db", error);
        process.exit(1);
    }
}

module.exports = connect;