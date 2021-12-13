const express = require('express');
const router = express.Router();
const path = require('path');

const userController = require('../controllers/user')
const courseController = require('../controllers/courseController')
const {userAuth} = require('../middlewares/userAuth')

router.post('/signup', userController.signup)
router.post ('/login',userController.login)

router.post('/googleSignup', userController.googleSignup)
router.post('/googleLogin', userController.googleLogin)
// routes beneath this middleware will be protected by jwt


router.get('/test',userAuth, userController.home)   
router.get('/getProfileData',userAuth,userController.getProfileData)
router.post('/updateProfile',userAuth,userController.updateProfile)
router.post('/updateProfilePic',userAuth, userController.updateProfilePic)

// course api
router.get('/getCourses',userAuth,courseController.getCourse)

module.exports = router;
