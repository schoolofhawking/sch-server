const express = require('express');
const router = express.Router();

const userController = require('../controllers/user')
const {userAuth} = require('../middlewares/userAuth')

router.post('/signup', userController.signup)
router.post ('/login',userController.login)

router.post('/googleSignup', userController.googleSignup)
router.post('/googleLogin', userController.googleLogin)
// routes beneath this middleware will be protected by jwt
router.use(userAuth);

router.get('/test', userController.home)   
router.get('/getProfileData',userController.getProfileData)
router.post('/updateProfile',userController.updateProfile)
module.exports = router;