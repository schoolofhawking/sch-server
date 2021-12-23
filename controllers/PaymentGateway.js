const RazorPay = require("razorpay");
const user = require("../models/user");
const purchase = require("../models/purchase");
var instance = new RazorPay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});
module.exports = {
  createOrder: async (req, res) => {
    console.log("HERE", req.body);
    try {
      const payment_capture = true;
      const amount = req.body.courseData.actualPrice * 100;
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
    console.log("PaySucess", req.body);
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
      let exists = await purchase.findOne({ _id: req.body.courseData.id });
      if (exists) {
        await purchase.updateOne(
          { _id: req.body.courseData.id },
          { $push: { userList: orderDetails } }
        );
      } else {
        var newOrder = new purchase({
          courseId: req.body.courseData.id,
          userList: [orderDetails],
        });
        newOrder.save();
      }
      let newUserData=await user.findOne({ _id: req.body.userData.userId })

      res.json({
        error: false,
        data:newUserData
      });

    } catch (err) {
      console.log(err);

      res.json({
        error: true,
      });
    }
  },
};
