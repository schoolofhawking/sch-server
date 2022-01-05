let mongoose = require('mongoose')
const { Schema } = mongoose;
const {ObjectId} = mongoose.Schema;
const helpSchema = new Schema(
    {
        user:{
            type:ObjectId,
            ref:'user'
        }
    },
    { timestamps: true }
    
);

module.exports = help = mongoose.model('help', helpSchema);
