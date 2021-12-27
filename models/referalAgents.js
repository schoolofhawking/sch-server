let mongoose = require('mongoose')
const { Schema } = mongoose;
const {ObjectId} = mongoose.Schema;

const agentSchema = new Schema(
    {
        fullName: {
            type: String,
            trim: true,
            required: [true, "fullname is required"]
        },
        phoneNumber:{
            type: String,
            trim: true,
            required: [true, "phone is required"]
        },
        place:{
            type: String,
            trim: true,
            required: [true, "place is required"]
        },
        referLink: {
            type: String,
           default:0
        },
        usersJoined: {
            type: Number,
            default:0     
       },
        
    },
    { timestamps: true }
);

module.exports = referalAgents = mongoose.model('referalAgents', agentSchema);
