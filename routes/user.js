const express = require('express');
const router = express.Router();

const userController = require('../controllers/user')
const {userAuth} = require('../middlewares/userAuth')

router.post('/signup', userController.signup)
router.post ('/login',userController.login)
// routes beneath this middleware will be protected by jwt
router.use(userAuth);

router.get('/test', userController.home)   

module.exports = router;