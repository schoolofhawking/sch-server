const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {
  signupValidation,
  loginValidation,
} = require("../validations/user/userValidator");

//  signup
module.exports = {
  login: async (req, res) => {
    let params = req.body;

    // data validation
    const dataValidation = await loginValidation(params);

    if (dataValidation.error) {
      const message = dataValidation.error.details[0].message.replace(/"/g, "");
      console.log(message);
      return res.json({
        error: true,
        data: "",
        message: message,
      });
    }

    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        // compare passwrd

        let passwordMatch = await bcrypt.compare(
          req.body.password,
          user.password
        );

        if (passwordMatch) {
          // create signed jwt
          const token = await jwt.sign(
            { _id: user._id },
            process.env.JWT_SECRET,
            {
              expiresIn: "30d",
            }
          );
          // send token in cookie
          const cookie = req.cookies.token;

          res.cookie("authToken", token);

          let responseData = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            mobileNumber: user.mobileNumber,
            jwtToken: token,
          };

          res.json({
            error: false,
            data: responseData,
            message: "Login Successfully",
          });
        } else {

          res.json({
            error:true,
            passwordErr:true,
            message: 'Incorrect password! Please check your password and try again'
          })
        }
      } else {

        res.json({
          error:true,
          emailErr:true,
          message: 'Incorrect Email! Please check your Email and try again'
        })

      }
    } catch (err) {
      console.log(err);

      res.status(500).json({
        error: true,
        message: err + "",
      });


    }
  },

  signup: async (req, res) => {
    console.log(req.body);
    let params = req.body;

    // data validation
    const dataValidation = await signupValidation(params);
    if (dataValidation.error) {
      const message = dataValidation.error.details[0].message.replace(/"/g, "");
      console.log(message);
      return res.json({
        error: true,
        data: "",
        message: message,
      });
    }

    try {
      // Existing validation
      let userExist = await User.findOne({ email: req.body.email });
      if (userExist) {
        console.log("user already exists");
        return res.json({
          error: true,
          data: "",
          message: "Email is already taken, try another email.",
        });
      }

      // password hashing
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      //register
      const user = new User({
        fullName: req.body.fullName,
        email: req.body.email,
        password: hashedPassword,
        mobileNumber: req.body.phoneNumber,
      });
      let savedUser = await user.save();

      // create signed jwt
      const token = await jwt.sign(
        { _id: savedUser._id },
        process.env.JWT_SECRET,
        {
          expiresIn: "30d",
        }
      );

      // send token in cookie
      const cookie = req.cookies.token;

      res.cookie("authToken", token);

      let responseData = {
        _id: savedUser._id,
        fullName: savedUser.fullName,
        email: savedUser.email,
        mobileNumber: savedUser.mobileNumber,
        jwtToken: token,
      };
      console.log(responseData, "registration Success");

      // send user as json response
      res.json({
        error: false,
        data: responseData,
        message: "Registered successfully",
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        error: true,
        message: err + "",
      });
    }
  },
  home: async (req, res) => {
    try {
      console.log("hai");
    } catch (err) {}
  },
};
