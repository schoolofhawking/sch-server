let mongoose = require('mongoose')
const { Schema } = mongoose;
const {ObjectId} = mongoose.Schema;

const courseSchema = new Schema(
    {
        courseName: {
            type: String,
            trim: true,
            required: [true, "Name is required"]
        },
        author: {
            type: String,
            trim: true,
            required: [true, "Author is required"],
        },
        duration: {
            type: String,
            trim: true,
        },
        courseDescription: {
            type: String,
            trim: true,
            required: [true, "description is required"],
        },
        courseDescription2: {
            type: String
        },
        courseCategory: {
            type: ObjectId,
            ref: 'category',
            required:true
        },
        actualPrice: {
            type: Number,
            min: 0,
            max: 10000000,
            required: [true, "actualPrice is required"]
        },
        discountPrice: {
            type: Number,
            min: 0,
            max: 10000000,
            required: [true, "discountPrice is required"]
        },
        demoVideo: {
            type: String
        },
        thumbnailImage: {
            type: String,
            required: [true, "thumbnail is required"]
        },
        discountPercentage: {
            type: Number,
        },
        subCourses: [{
            type: String,
        }],
        role: {
            type: String,
            default: 1        //for normal user role=1, ADMIN ROLE=0
        },
        isBlocked: {
            type: Boolean,
            default: false
        },
        loginType: {
            type: String,
            default: 'Manual'
        },
        metaData: {},
        profileImage: {
            type: String
        }
    },
    { timestamps: true }
);

module.exports = Course = mongoose.model('course', courseSchema);
