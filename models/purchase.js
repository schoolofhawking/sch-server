let mongoose = require('mongoose')
const { Schema } = mongoose;
const {ObjectId} = mongoose.Schema;

const purchaseSchema = new Schema(
    {
        courseId:{
            type:ObjectId,
            ref:'course',
            required:true
        },  
        userList: [{
            userId:{
                type:ObjectId,
                ref:'user'
            },
            paymentId:{
                type:String,
                ref:'transaction'
            },
            orderId:{
                type:String,
                trim:true
            },
            razorpay_signature:{
                type:String,
                trim:true
            }
        }],
        
    },
    { timestamps: true }
);

module.exports = Purchase = mongoose.model('purchase', purchaseSchema);
