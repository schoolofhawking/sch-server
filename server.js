

const express =require('express');
 const bodyParser =require('body-parser');
const cors= require('cors')
const path = require("path");
const app = express();
const morgan=require('morgan')



// apply middlewares
app.use(cors());
//serve static files
app.use(express.static("images"));
app.use("/images", express.static(path.join(__dirname, "/images")));
app.use(express.json({ limit: "50mb" }));
app.use(morgan("dev"));




app.get("/", (req, res, next) => {
  
 res.send("Welcome to project SCH");

});




app.listen(7000, () => {

  console.log(`Server is running`);


});
