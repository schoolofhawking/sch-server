
const express = require('express');
const admincontroller = require('../controllers/admin');
const { adminAuth } = require('../middlewares/adminAuth');
const router = express.Router();



//routes besides this falls under JWT Authentication
// router.use(adminAuth)

router.post('/adminLogin',admincontroller.adminLogin)
router.get('/getUsers', adminAuth,admincontroller.getUsers)
router.post('/unBlockUser',adminAuth, admincontroller.unBlockUser)
router.post('/BlockUser',adminAuth, admincontroller.blockUser)
router.get('/getAdmins',adminAuth, admincontroller.getAdmins)
router.post('/DismissAdmin',adminAuth, admincontroller.DismissAdmin)

module.exports = router;