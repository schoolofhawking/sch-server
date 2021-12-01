const user = require("../models/user");


//  signup
module.exports = {
 getUsers:async(req,res)=>{

try{

    let users = await user.find({});


    res.json({
        error: false,
        data: users,
      });
}
catch(err)
{
    
    res.json({
        error: true,
        message: "something went wrong",
      });
}
 },

 blockUser:async(req,res)=>{

try
{


   let result= await user.updateOne({_id:req.body.id},{$set:{isBlocked:true}})

    res.json({
        error: false
      });
  
}
catch(err)
{
    console.log("userr",err);
    res.json({
        error: true,
        message: "something went wrong",
      });
}
 },

 
 unBlockUser:async(req,res)=>{

    try
    {
    
      
      
       let result= await user.updateOne({_id:req.body.id},{$set:{isBlocked:false}})
    
        res.json({
            error: false
          });
          console.log("userr",result);
    }
    catch(err)
    {
        console.log("userr",err);
        res.json({
            error: true,
            message: "something went wrong",
          });
    }
     }
};
