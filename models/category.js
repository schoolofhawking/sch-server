let mongoose = require('mongoose')
const { Schema } = mongoose;

const courseCategorySchema = new Schema(
    {
        categoryName: {
            type: String,
            trim: true,
            required: [true, "Name is required"]
        },
        description1: {
            type: String,
            trim: true,
        },
        description2: {
            type: String,
            trim: true,
        },
        status:{
type:String,
default:1     //if category is active use 1 and for deactivate use 0

        }
    },
    { timestamps: true }
);

module.exports = Category = mongoose.model('category', courseCategorySchema);
