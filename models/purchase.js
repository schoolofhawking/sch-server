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
            transactionId:{
                type:ObjectId,
                ref:'transaction'
            }
        }],
        
    },
    { timestamps: true }
);

module.exports = Purchase = mongoose.model('purchase', purchaseSchema);
