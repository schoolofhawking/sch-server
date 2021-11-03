let User=require('../models/user')
var bcrypt=require('bcrypt')
let jwt =require( "jsonwebtoken");


//  signup
export const signup = async (req, res) => {


    console.log("coookieeee",req.cookies.authToken)
    console.log(req.body)
  let nameRegExp = new RegExp("^.{1,50}$");

  let emailRegexp =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  let pwdRegExp = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,15}$"
  );

  if (
    !req.body.firstName &&
    !req.body.lastName &&
    !req.body.email &&
    !req.body.password &&
    !req.body.password1
  ) {
    return res
      .status(400)
      .json({ allEmpty: true, message: "All Mandatory fields are required*" });
  }

  if (!req.body.password) {
    return res
      .status(400)
      .json({ sku: true, message: "Password required*" });
  }

  if (!req.body.email) {
    return res
      .status(400)
      .json({ monthlyCapacity: true, message: "email is required*" });
  }

  if (!nameRegExp.test(req.body.fullname)) {
    return res.status(400).json({
      fullname: true,
      message: "First Name must be between max 50 characters only",
    });
  }

  if (!req.body.email) {
    return res.status(400).json({ email: true, message: "Email is required*" });
  }
  if (!emailRegexp.test(req.body.email)) {
    return res
      .status(400)
      .json({ email: true, message: "Please Enter a valid email" });
  }

  if (!req.body.password) {
    return res
      .status(400)
      .json({ password: true, message: "Password is required*" });
  }

  
  

  try {
    let userExist = await User.findOne({ email: req.body.email }).exec();

    if (userExist) {
        console.log("user already exists")
      return res.status(400).json({
        email: true,
        message: "Email is already taken, try another email.",
      });
    }

    const hashedPassword = await await bcrypt.hash(req.body.password,10)

    //register
 
    const user = new User({
      fullName: req.body.fullName,
      email: req.body.email,
      password: hashedPassword,
      mobileNumber: req.body.phoneNumber,
    });
    await user.save();

    const person = await User.findOne({email:req.body.email});


    // create signed jwt
    const token =await jwt.sign({ _id: person._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
  person.jwtToken=await token;

  console.log("perssson",token);
      
      // send token in cookie
    

      const cookie = req.cookies.token;


      res.cookie("authToken" , token);

      
      // send user as json response


    res.json(person)

    
  } catch (err) {
      console.log(err)
    res.send(err);
  }
};
