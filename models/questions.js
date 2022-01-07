let mongoose = require('mongoose')
const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema;

const questionSchema = new Schema(
    {
        question: {
            type: String,
            trim: true,
            required: [true, "question is required"]
        },
        optionA: {
            option: {
                type: String,
                trim: true,
                required: [true, "answer Option is required"],
            },
            departmentId: {
                type: ObjectId,
                ref: 'careerDepartment',
                required: [true, "department is required"],
            }
        },
        optionB: {
            option: {
                type: String,
                trim: true,
                required: [true, "answer Option is required"],
            },
            departmentId: {
                type: ObjectId,
                ref: 'careerDepartment',
                required: [true, "department is required"],
            }
        },
        optionC: {
            option: {
                type: String,
                trim: true,
                required: [true, "answer Option is required"],
            },
            departmentId: {
                type: ObjectId,
                ref: 'careerDepartment',
                required: [true, "department is required"],
            }
        },
        optionD: {
            option: {
                type: String,
                trim: true,
                required: [true, "answer Option is required"],
            },
            departmentId: {
                type: ObjectId,
                ref: 'careerDepartment',
                required: [true, "department is required"],
            }
        },
        correctAnswer: {
            type: String,
            trim: true,
            required: [true, "answer Option is required"],
        },
        comments: {
            type: String,
            trim: true
        },
        isActive: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

module.exports = questions = mongoose.model('questions', questionSchema);
