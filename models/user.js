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
            required: true
        },
        mobileNumber: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true,
            min: 6,
            max: 64
        },
        role: {
            type: String,
           default:1        //for normal user role=1, ADMIN ROLE=0
        },
    },
    {timestamps:true}
);

// export default mongoose.model('User', userSchema);
module.exports = User = mongoose.model('user', userSchema);
