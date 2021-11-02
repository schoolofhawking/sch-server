// this route is for authentication and user entry handling
// signup and login fn are written here

const express = require('express');
const { signup } = require('../controllers/auth');
const router = express.Router();



router.post('/signup',signup)




module.exports = router;