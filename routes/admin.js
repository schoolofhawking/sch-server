
const express = require('express');
const admincontroller = require('../controllers/admin');
const { adminAuth } = require('../middlewares/adminAuth');
const courseController = require('../controllers/courseController');
const questionController = require('../controllers/questionController');
const agentController = require('../controllers/agentController');
const PaymentGateway = require('../controllers/PaymentGateway');
const CareerDepartmentController = require('../controllers/careerDepartmentController');

const router = express.Router();

//routes besides this falls under JWT Authentication

router.post('/adminLogin', admincontroller.adminLogin)
router.get('/getUsers', adminAuth, admincontroller.getUsers)
router.post('/unBlockUser', adminAuth, admincontroller.unBlockUser)
router.post('/BlockUser', adminAuth, admincontroller.blockUser)
router.get('/getAdmins', adminAuth, admincontroller.getAdmins)
router.post('/DismissAdmin', adminAuth, admincontroller.DismissAdmin)
router.post('/addNewAdmin', adminAuth, admincontroller.AddNewAdmin)
router.get('/getCategories', adminAuth, admincontroller.getCourseCategories)
router.get('/getLiveCategories', adminAuth, admincontroller.getLiveCategories)
router.post('/addNewCategory', adminAuth, admincontroller.addNewCategory)
router.post('/deActivateCategory', adminAuth, admincontroller.deActivateCategory)
router.post('/activateCategory', adminAuth, admincontroller.activateCategory)
// course apis 
router.post('/addCourse', adminAuth, courseController.addCourse)
router.get('/getCourse', adminAuth, courseController.getCourse)
router.post('/getCourseById', adminAuth, courseController.getCourseById)
router.get('/getSubCourse', adminAuth, courseController.getSubCourse)
router.post('/addSubCourse', adminAuth, courseController.addSubCourse)
router.post('/subCourseAddVideo', adminAuth, courseController.addVideoSubCourse)
router.put('/editCourse', adminAuth, courseController.editCourse)


// question apis-admin side
router.post('/addNewQuestion', adminAuth, questionController.addNewQuestion)
router.get('/getQuestions', adminAuth, questionController.getAllQuestions)
router.post('/activateDeactivateQuestion', adminAuth, questionController.activateOrDeactivateQuestion)

//agent referal apis

router.post('/addNewAgent', adminAuth, agentController.addNewAgent)
router.get('/getAllAgents', adminAuth, agentController.getAllagents)
router.get('/getHelps', adminAuth, PaymentGateway.getAllHelps)

// career department apis
router.post('/addCareerDepartment', adminAuth, CareerDepartmentController.addDepartment)

//payment related
router.get('/getPurchases',PaymentGateway.getAllPayments)
router.post('/getPurchaseDetails',PaymentGateway.getPaymetDetails)
module.exports = router;
