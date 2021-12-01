
const express = require('express');
const admincontroller = require('../controllers/admin');
const router = express.Router();



router.get('/getUsers', admincontroller.getUsers)

router.post('/unBlockUser', admincontroller.unBlockUser)
router.post('/BlockUser', admincontroller.blockUser)

module.exports = router;