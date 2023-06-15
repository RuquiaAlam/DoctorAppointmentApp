const express  = require("express");
const colors =require("colors");
const morgan =require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors =require("cors");
const bodyParser = require("body-parser");

const path = require("path");


//rest object

//dotenv config

//mongodb connection
connectDB();
dotenv.config();
//middlewares
const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cors({origin: "http:localhost:5000", credentials: true}));
app.use(cors()) ;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(express.urlencoded({extended: true}));



//routes
// app.get("/",(req,res)=>{
// res.status(200).send({
//     message:"server running",
// })
// });

app.use("/api/v1/user", require("./routes/userRoutes"));
app.use("/api/v1/admin", require("./routes/adminRoutes"));
app.use("/api/v1/doctor", require("./routes/doctorRoutes"));


//static files
 app.use(express.static(path.join(__dirname,"/client/build")))
 app.get('*',function(req,res){
    //run index.html
    res.sendFile(path.join(__dirname,"/client/build/index.html"));
 })

// app.use("/api/v1/events", require("./routes/userRoutes"));

// //static files
// app.use(express.static(path.join(__dirname, "./client/build")));

// app.get("*", function (req, res) {
//   res.sendFile(path.join(__dirname, "./client/build/index.html"));
// });
const port = process.env.PORT || 8080;
//listen port
app.listen(port ,()=>{
    console.log(`Server running on ${process.env.NODE_MODE} Mode on port ${process.env.PORT}`.bgCyan.white);
});