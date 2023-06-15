const mongoose = require('mongoose');
const colors = require('colors');

const dotenv = require("dotenv");

dotenv.config();


const connectDB = async() => {
    try{
await mongoose.connect("mongodb+srv://Ruquia:techiebrains6@cluster0.mxlm7ff.mongodb.net/docapp?retryWrites=true&w=majority")
console.log(process.env.MONGO_URL);
console.log(`Mongodb connected ${mongoose.connection.host}`.bgGreen.white )
    }
    catch(error){
console.log(`Mongo db server issue ${error}`.bgRed.white);

    }
};

module.exports = connectDB;
