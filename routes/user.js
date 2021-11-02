const express = require('express');
const router = express.Router();



router.get('/',(req,res)=>{
    

    res.send('HI WELCOME TO SCH SERVER')
})




module.exports = router;
