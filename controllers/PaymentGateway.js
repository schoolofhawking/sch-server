const RazorPay = require("razorpay");
const user = require("../models/user");
const help = require("../models/help");
const purchase = require("../models/purchase");
const { AggregationCursor } = require("mongoose");
const agentController = require("./agentController");
var instance = new RazorPay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});
module.exports = {
  createOrder: async (req, res) => {
    console.log("HERE", req.body);
    try {
      const payment_capture = true;
      const amount = req.body.courseData.discountPrice * 100;
      const currency = "INR";
      const receipt = req.body.id;
      const notes = {
        platform: "skill2fly",
        course: req.body.courseData.courseName,
        courseId: req.body.courseData.id,
      };
      const response = await instance.orders.create({
        amount,
        currency,
        receipt,
        payment_capture,
        notes,
      });
      console.log("order", response);
      res.json({
        error: false,
        data: response,
      });
    } catch (err) {
      console.log(err);
      res.json({
        error: true,
      });
    }
  },
  paymentSuccess: async (req, res) => {
    console.log("eeeeeeeee", req.body);
    try {
      let orderDetails = {
        userId: req.body.userData.userId,
        paymentId: req.body.razorpayResponse.razorpay_payment_id,
        orderId: req.body.razorpay_order_id,
        razorpay_signature: req.body.razorpay_signature,
      };

      await user.updateOne(
        { _id: req.body.userData.userId },
        { $push: { purchasedCourses: req.body.courseData.id } }
      );

      //  find if course exists in purchase db

    
      let exists = await purchase.findOne({ courseId: req.body.courseData.id });
      if (exists) {

        console.log("new err happend")

        try{
        await purchase.updateOne(
          { courseId: req.body.courseData.id },
          { $push: { userList: orderDetails } }
        );

        }
        catch(err)
        {
          console.log("its an err")
        }
      } else {

        console.log("ifffffffffffff",exists)
        var newOrder = new purchase({
          courseId: req.body.courseData.id,
          userList: [orderDetails],
        });
        newOrder.save();
      }

      let newUserData = await user.findOne({ _id: req.body.userData.userId });
      console.log("22222222", newUserData);

      let NewReferralId = 0;
      if (newUserData.referredBy) {
        NewReferralId = newUserData.referredBy;
      }
      // updating on agent profile -->payment success so increment affects in it
      await agentController.updateUsers(NewReferralId).then((result) => {
        res.json({
          error: false,
          data: newUserData,
        });
      });
    } catch (err) {
      console.log(err);

      res.json({
        error: true,
      });
    }
  },

  getHelp: async (req, res) => {
    console.log(req.body);
    try {
      let newHelp = new help({
        user: req.body.userId,
      });
      await newHelp.save();

      res.json({
        error: false,
      });
    } catch (err) {
      res.json({
        error: true,
      });
    }
  },

  getAllHelps: async (req, res) => {
    try {
      let data = await help
        .find()
        .populate({
          path: "user",
          select: ["_id", "fullName", "email", "mobileNumber"],
        });

      console.log("", data);

      res.json({
        error: false,
        data: data,
      });
    } catch (err) {
      res.json({
        error: true,
      });
    }
  },

  getAllPayments: async (req, res) => {
    try {
      let data = await purchase.find().populate('courseId');
      res.json({
        data: data,
        error: false,
      });
    } catch (err) {
      res.json({
        data: data,
        error: true,
      });
    }
  },

  getPaymetDetails:async(req,res)=>{

    try{
      let data = await purchase.find({_id:req.body.id}).populate('userList.userId')
      res.json({
        data: data,
        error: false,
      });

      console.log(data)
    }
    catch(err)
    {
      res.json({
        data: data,
        error: true,
      });
    }
  }
};
