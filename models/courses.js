let mongoose =require('mongoose') 
const {Schema} = mongoose;

const courseSchema = new Schema(
    {
        courseName: {
            type: String,
            trim: true,
            required: true
        },
        courseDescription: {
            type: String,
            trim: true,
            unique: true,
            required: true,
            lowercase: true
        },
        courseDescription2: {
            type: String
        },
        courseCategory: {
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

module.exports = Course = mongoose.model('course', courseSchema);
