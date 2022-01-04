const Vonage = require('@vonage/server-sdk')

const vonage = new Vonage({
  apiKey: process.env.SMS_API_KEY,
  apiSecret: process.env.SMS_SECRET
})


export const sendSms = (req,res) => {
    console.log("phonneenu",req.body.phoneNumber)

    try{
       

        const from = "Vonage APIs"
const to = process.env.PHONE_NUMBER
const text = `FROM SKILL2FLY---  HI I NEED A COURSE TO BUY CONTACT ME ON: ${req.body.phoneNumber}`

vonage.message.sendSms(from, to, text, (err, responseData) => {
    if (err) {
        console.log("------------",err);

        res.json({
            error:true
        })
    } else {
        if(responseData.messages[0]['status'] === "0") {
            console.log("Message sent successfully.");
            res.json({
                error:false
            })
        } else {
            res.json({
                error:true
            })
            console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
        }
    }
})

    }
    catch(err)
    {
console.log("0000",err)
res.json({
    error:true
})
   
    }
   

};
