const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AWS = require('aws-sdk')
const FileValidation = require('../helpers/FileValidation')
const fs = require('fs');
const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink)

const {
  signupValidation,
  loginValidation,
  profileUpdateValidation
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
        if (user.isBlocked == false) {
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
              error: true,
              passwordErr: true,
              message: 'Incorrect password! Please check your password and try again'
            })
          }
        } else {
          res.json({
            error: true,
            blockErr: true,
            message: 'Sorry!!! You have been temporarily Blocked by Admin'
          })
        }
      } else {

        res.json({
          error: true,
          emailErr: true,
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
    } catch (err) { }
  },

  // for google sig

  googleSignup: async (req, res) => {

    console.log(req.body);


    try {


      let userExists = await User.findOne({ email: req.body.email });

      if (userExists) {
        return res.json({
          error: true,
          data: "",
          message: "Email is already registered. Please login",
        });

        // user prompts to login automatically 

        // this.googleLogin(req);
      }
      else {
        const user = new User({
          fullName: req.body.userName,
          email: req.body.email,
          mobileNumber: '',
          loginType: "google"
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
          mobileNumber: "",
          jwtToken: token,
        };
        console.log(responseData, "registration Success");

        // send user as json response
        res.json({
          error: false,
          data: responseData,
          message: "Registered successfully",
        });

      }
    }
    catch (err) {

      console.log("err", err)
      res.json({
        error: err,
        message: err,
      });

    }


  },

  googleLogin: async (req, res) => {

    try {
      console.log(req.body)
      let user = await User.findOne({ email: req.body.email });
      if (user) {

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
          mobileNumber: "",
          jwtToken: token,
        };

        res.json({
          error: false,
          data: responseData,
          message: "Login Successfully",
        });


      } else {
        console.log("I dont know this guy");

        res.json({
          error: true,
          data: responseData,
          message: "User is not registered yet",
        });
      }
    } catch (err) {
      console.log(err);

      res.status(500).json({
        error: true,
        message: err + "",
      });


    }
  },
  getProfileData: async (req, res, next) => {
    try {
      let userData = req.user
      let profileData = {
        profileName: userData.fullName,
        profileEmail: userData.email,
        profilePhone: userData.mobileNumber,
        profileCountry: userData.metaData?.country ?? '-',
        profileState: userData.metaData?.state ?? '-',
        profileCity: userData.metaData?.city ?? '-',
        profileQualification: userData.metaData?.qualification ?? '-',
        profileDesignation: userData.metaData?.designation ?? '-',
        profileEnable: true
      }
      res.json({ error: false, profileData })


    } catch (err) {
      console.log(err);
    }
  },
  updateProfile: async (req, res, next) => {
    try {
      const dataValidation = await profileUpdateValidation(req.body);
      if (dataValidation.error) {
        const message = dataValidation.error.details[0].message.replace(/"/g, "");
        console.log(message);
        return res.json({
          error: true,
          data: "",
          message: message,
        });
      }
      const { fullName, phoneNumber, email, country, state, city, designation, qualification } = req.body

      let data = {
        fullName,
        mobileNumber: phoneNumber,
        metaData: {
          country,
          state,
          city,
          designation,
          qualification
        }
      }
      let userData = await User.findOneAndUpdate({ _id: req.user._id }, data, { upsert: true, new: true })
      let profileData = {
        profileName: userData.fullName,
        profileEmail: userData.email,
        profilePhone: userData.mobileNumber,
        profileCountry: userData.metaData?.country ?? '-',
        profileState: userData.metaData?.state ?? '-',
        profileCity: userData.metaData?.city ?? '-',
        profileQualification: userData.metaData?.qualification ?? '-',
        profileDesignation: userData.metaData?.designation ?? '-',
        profileEnable: true
      }
      res.json({ error: false, message: "Profile Updation Successful", profileData })

    } catch (err) {
      console.log(err);
    }
  },

  updateProfilePic: async (req, res) => {
    try {
      let profileImg = req.files.image
      console.log(profileImg, "file data");
      let notImage = FileValidation.checkImageType(profileImg)
      if (notImage == false) {
        let s3bucket = new AWS.S3({
          accessKeyId: process.env.IAM_ACCESS_KEY,
          secretAccessKey: process.env.IAM_SECRET_KEY,
          Bucket: process.env.AWS_USER_BUCKET
        });
        s3bucket.createBucket(function () {
          var params = {
            Bucket: process.env.AWS_USER_BUCKET,
            Key: '' + req.user._id + '.jpg',
            Body: profileImg.data
          };
          s3bucket.upload(params, function (err, data) {
            if (err) {
              console.log('error in callback');
              console.log(err);
              return res.json({
                error: true,
                message: 'Image Upload Failed!!'
              })
            } else {
              console.log('<<===S3 IMG UPLOAD SUCCESS===>>');
              console.log(data);
              return res.json({
                error: false,
                message: 'Image uploaded Successfully'
              })
            }

          });
        });
      }else{
        return res.json({
          error: true,
          message: 'File is not an Image'
        })
      }
    } catch (error) {
      return res.json({
        error: true,
        message: 'Server Error!!!'
      })
    }
  }
};
