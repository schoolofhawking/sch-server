
const express = require('express');
const admincontroller = require('../controllers/admin');
const { adminAuth } = require('../middlewares/adminAuth');
const router = express.Router();

router.post('/adminLogin',admincontroller.adminLogin)


//routes besides this falls under JWT Authentication
router.use(adminAuth)
router.get('/getUsers', admincontroller.getUsers)
router.post('/unBlockUser', admincontroller.unBlockUser)
router.post('/BlockUser', admincontroller.blockUser)


module.exports = router;