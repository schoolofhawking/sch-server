const express = require('express');
const router = express.Router();
const multer  = require('multer');
const path = require('path');

const userController = require('../controllers/user')
const {userAuth} = require('../middlewares/userAuth')

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'public/images')
    },
    filename(req, file, cb) {
        cb(
        null,
        `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        )
    },
})

const upload = multer({
    storage
})

router.post('/signup', userController.signup)
router.post ('/login',userController.login)

router.post('/googleSignup', userController.googleSignup)
router.post('/googleLogin', userController.googleLogin)
// routes beneath this middleware will be protected by jwt


router.get('/test',userAuth, userController.home)   
router.get('/getProfileData',userAuth,userController.getProfileData)
router.post('/updateProfile',userAuth,userController.updateProfile)
router.post('/updateProfilePic',upload.single('image'), userController.updateProfilePic)

module.exports = router;
