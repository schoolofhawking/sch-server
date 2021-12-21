const RazorPay = require("razorpay");

var instance = new RazorPay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});
module.exports = {
  createOrder: async (req, res) => {
    console.log("HERE",req.body);
    try {
      const payment_capture = true;
      const amount = 5000;
      const currency = "INR";
      const receipt =req.body.id;
const notes={
  a:'skill2fly'
}
      const response = await instance.orders.create({
        amount,
        currency,
        receipt,
        payment_capture,
        notes,
      });
      console.log("order", response);
      res.json({
        error:false,
        data:response
    })
    } catch (err) {
      console.log(err);
        res.json({
            error:true
        })
    }
  },
};
