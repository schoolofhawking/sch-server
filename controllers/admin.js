const user = require("../models/user");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


//  signup
module.exports = {

  getUsers: async (req, res) => {
    try {
      let users = await user.find({role:"1"});
      res.json({
        error: false,
        data: users,
      });
    }
    catch (err) {
      res.json({
        error: true,
        message: "something went wrong",
      });
    }
  },

  blockUser: async (req, res) => {
    try {
      let result = await user.updateOne({ _id: req.body.id }, { $set: { isBlocked: true } })
      res.json({
        error: false
      });
    }
    catch (err) {
      console.log("userr", err);
      res.json({
        error: true,
        message: "something went wrong",
      });
    }
  },


  unBlockUser: async (req, res) => {
    try {
      let result = await user.updateOne({ _id: req.body.id }, { $set: { isBlocked: false } })
      res.json({
        error: false
      });
      console.log("userr", result);
    }
    catch (err) {
      console.log("userr", err);
      res.json({
        error: true,
        message: "something went wrong",
      });
    }
  },
  adminLogin: async (req, res) => {
    try {
      const { username, password } = req.body
      let admin = await user.findOne({ email: username })
      if (!admin) {
        res.json({
          error: true,
          message: "Unknown User!!!",
        });
      } else {
        if (admin.role != '0') {
          res.json({
            error: true,
            message: "Sorry You are not an Admin!!",
          });
        } else if (admin.role == '0') {
          let passwordMatch = await bcrypt.compare(
            password,
            admin.password
          );
          if (passwordMatch) {
            const token = await jwt.sign(
              { _id: admin._id },
              process.env.JWT_SECRET,
              {
                expiresIn: "1h",
              }
            );
            let responseData = {
              adminId: admin._id,
              adminName: admin.fullName,
              adminEmail: admin.email,
              adminJwt: token,
              adminLogin: true
            }
            res.json({
              error: false,
              data: responseData
            })
          }else{
            res.json({
              error: true,
              message: "Mr."+admin.fullName+", Your Password is Wrong!!!"
            })
          }
        } else {
          res.json({
            error: true,
            message: "You are not an Admin"
          })
        }
      }
    } catch (err) {
      console.log(err);
      res.json({
        error: true,
        message: "something went wrong",
      });
    }
  },

  getAdmins:async(req,res)=>{

    try {
      let users = await user.find({role:"0"});
      res.json({
        error: false,
        data: users,
      });
    }
    catch (err) {
      res.json({
        error: true,
        message: "something went wrong",
      });
    }


  },
  DismissAdmin:async(req,res)=>{
    try {
      let result = await user.updateOne({ _id: req.body.id }, { $set: { role: "1" } })
      res.json({
        error: false
      });
      console.log("userr", result);
    }
    catch (err) {
      console.log("userr", err);
      res.json({
        error: true,
        message: "something went wrong",
      });
    }
  }


};
