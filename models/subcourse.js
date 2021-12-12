let mongoose = require('mongoose')
const { Schema } = mongoose;
const {ObjectId} = mongoose.Schema;

const subCourseSchema = new Schema(
    {
        subCourseName: {
            type: String,
            trim: true,
            required: [true, "Sub Course Name is required"]
        },
        mainCourseId: {
            type: ObjectId,
            ref: 'course',
            required:true
        },  
        videoList: [{
            videoName:{type:String},
            videoId:{type:String}
        }],
        
    },
    { timestamps: true }
);

module.exports = SubCourse = mongoose.model('subcourse', subCourseSchema);
