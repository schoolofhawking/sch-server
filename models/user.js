let mongoose =require('mongoose') 
const {Schema} = mongoose;

const userSchema = new Schema(
    {
        fullName: {
            type: String,
            trim: true,
            required: true
        },
        email: {
            type: String,
            trim: true,
            unique: true,
            required: true,
            lowercase: true
        },
        mobileNumber: {
            type: String
        },
        password: {
            type: String,
            min: 6,
            max: 64
        },
        role: {
            type: String,
           default:1        //for normal user role=1, ADMIN ROLE=0
        },
        isBlocked: {
            type: Boolean,
            default: false
        },
        loginType:{
         
            type:String,
            default:'Manual'
        },
        metaData:{},
        profileImage: {
            type: String
        }
    },
    {timestamps:true}
);

// export default mongoose.model('User', userSchema);
module.exports = User = mongoose.model('user', userSchema);
