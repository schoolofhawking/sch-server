const user = require("../models/user");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const category = require("../models/category");


//  signup
module.exports = {

  getUsers: async (req, res) => {
    try {
      let users = await user.find({ role: "1" });
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
    console.log("!!!!!!!!!!!!")
    try {
      const { username, password } = req.body
      let admin = await user.findOne({ email: username })
      console.log('add', admin)
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
          } else {
            res.json({
              error: true,
              message: "Mr." + admin.fullName + ", Your Password is Wrong!!!"
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

  getAdmins: async (req, res) => {

    try {
      let users = await user.find({ role: "0" });
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
  DismissAdmin: async (req, res) => {
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
  },

  AddNewAdmin: async (req, res) => {
    try {
      let userExist = await User.findOne({ email: req.body.email });
      if (userExist) {
        let result = await user.updateOne({ email: req.body.email }, { $set: { role: 0 } })
        return res.json({
          error: false,
          data: "",
          message: "The user with name " + userExist.fullName + " Has been updated to Admin role..! Password and fullname cant be changed but updated to admin position!!!",
        });
      }
      else {
        // password hashing
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        //register
        const user = new User({
          fullName: req.body.name,
          email: req.body.email,
          password: hashedPassword,
          mobileNumber: "",
          role: '0'
        });
        let savedUser = await user.save();

        return res.json({
          error: false,
          data: "",
          message: "successfuly added new admin",
        });
      }

    }
    catch (err) {
      console.log("userr", err);
      res.json({
        error: true,
        message: "something went wrong",
      });
    }
  },

  getCourseCategories: async (req, res) => {
    try {
      let data = await category.find({});
      return res.json({
        error: false,
        data: data
      });
    }
    catch (err) {
      return res.json({
        error: true,
        data: err,
        message: "something went wrong"
      });
    }
  },

  getLiveCategories: async (req, res) => {
    try {
      let data = await category.find({status:1});
      return res.json({
        error: false,
        data: data
      });
    }
    catch (err) {
      return res.json({
        error: true,
        data: err,
        message: "something went wrong"
      });
    }
  },

  addNewCategory: async (req, res) => {
    try {
      console.log("rreq", req.body)
      let nameExists = await category.findOne({ categoryName: req.body.fieldValues.categoryName })
      if (nameExists) {
        return res.json({
          error: true,
          message: "Course Name already exists try again with another name"
        });
      }
      else {
        const newCategoy = new category({
          categoryName: req.body.fieldValues.categoryName,
          description1: req.body.fieldValues.description1,
          description2: req.body.fieldValues.description2
        })
        await newCategoy.save()
        return res.json({
          error: false,
          message: "Course Added successfully"
        });
      }
    }
    catch (err) {
      console.log(err)
      return res.json({
        error: true,
        data: err,
        message: "something went wrongg"
      });
    }
  },

  deActivateCategory: async (req, res) => {
    console.log("deeeeactivateeee", req.body);
    try {
      let result = await category.updateOne({ _id: req.body.id }, { $set: { status: 0 } })
      res.json({
        error: false,
        message: "success"
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

  activateCategory: async (req, res) => {
    console.log("activateeee");
    try {
      let result = await category.updateOne({ _id: req.body.id }, { $set: { status: 1 } })
      res.json({
        error: false,
        message: "success"
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
