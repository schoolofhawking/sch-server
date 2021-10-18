import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { readdirSync } from "fs";
const morgan = require("morgan");
import cookieParser from "cookie-parser";
const path = require("path");
const app = express();
require('dotenv').config()




// connect DB
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
app.use(cors());
//serve static files
app.use(express.static("images"));

app.use("/images", express.static(path.join(__dirname, "/images")));
app.use(express.json({ limit: "50mb" }));
app.use(morgan("dev"));


app.use(cookieParser());

// route - This func is for importing routes files automaticaly. so we dont need to import separately
readdirSync("./routes").map((r) => app.use("/", require(`./routes/${r}`)));

// port
const port = process.env.PORT || 2000;

app.listen(port, () => console.log(`Server is running on port ${port}`));
