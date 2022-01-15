let mongoose = require('mongoose')
const { Schema } = mongoose;

const careerDepartmentSchema = new Schema(
    {
        departmentName: {
            type: String,
            trim: true,
            required: [true, "Department Name is required"]
        },
        description: {
            type: String,
            trim: true,
        },
        interestedCount: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true 
        },
        isDefault: {
            type: Boolean,
        },
    },
    { timestamps: true }
);

module.exports = CareerDepartmentSchema = mongoose.model('careerDepartment', careerDepartmentSchema);
