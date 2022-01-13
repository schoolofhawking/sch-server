const express = require("express");
const router = express.Router();
const path = require("path");

const userController = require("../controllers/user");
const courseController = require("../controllers/courseController");
const { userAuth } = require("../middlewares/userAuth");
const questionController = require("../controllers/questionController");
const PaymentGateway=require('../controllers/PaymentGateway');

router.get('/test',(req,res)=>{
  
  res.send("hai");}
          )
router.post("/signup", userController.signup);
router.post("/login", userController.login);

router.post("/googleSignup", userController.googleSignup);
router.post("/googleLogin", userController.googleLogin);
// routes beneath this middleware will be protected by jwt

router.get("/getProfileData", userAuth, userController.getProfileData);
router.post("/updateProfile", userAuth, userController.updateProfile);
router.post("/updateProfilePic", userAuth, userController.updateProfilePic);

// course api
router.get("/getCourses", userAuth, courseController.getCourse);
router.post("/getSingleCourse", userAuth, courseController.getCourseById);

// questions api
router.get("/getQuestionsUser", userAuth, questionController.getAllQuestions);
//payment gateway
router.post('/createOrder',userAuth,PaymentGateway.createOrder)
router.post('/purchaseSuccess',userAuth,PaymentGateway.paymentSuccess)

//sms apis
router.post('/getHelp',userAuth,PaymentGateway.getHelp)

// question apis
router.post("/getQuestions", userAuth, questionController.getActiveQuestions);
router.post("/submitTest", userAuth, questionController.submitTest);

module.exports = router;
