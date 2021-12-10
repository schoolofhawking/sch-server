let express =require("express") ;
let cors =require('cors');
let mongoose = require("mongoose");
let fs =require("fs") ;
const fileupload = require('express-fileupload')
const morgan = require("morgan");
// import cookieParser from "cookie-parser";
const path = require("path");
const app = express();
require('dotenv').config()
const cookieParser = require('cookie-parser')
app.use(cookieParser());
const usersRouter=require('./routes/user')
const adminRouter=require('./routes/admin')


app.use(fileupload())

// connect DB
// use this "process.env.LOCAL_MONGO_DB" connection string for local db
mongoose
  .connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("MongoDB is connected"))
  .catch((err) => console.log("DB CONNECTION ERROR", err));

// apply middlewares
app.use(cors({credentials: true, origin: process.env.FRONT_END_URL}));


//serve static files
app.use(express.static("images"));

app.use("/images", express.static(path.join(__dirname, "/images")));
app.use(express.json({ limit: "50mb" }));
app.use(morgan("dev"));


app.use('/', usersRouter);
app.use('/admin', adminRouter);
// // route - This func is for importing routes files automaticaly. so we dont need to import separately
// fs.readdirSync("./routes").map((r) => app.use("/", require(`./routes/${r}`)));

// port
const port = process.env.PORT || 2000;

app.listen(port, () => console.log(`Server is running on port ${port}`));
