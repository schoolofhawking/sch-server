let mongoose = require('mongoose')
const { Schema } = mongoose;
const {ObjectId} = mongoose.Schema;

const questionSchema = new Schema(
    {
        question: {
            type: String,
            trim: true,
            required: [true, "question is required"]
        },
        optionA: {
            type: String,
            trim: true,
            required: [true, "answer Option is required"],
        },
        optionB: {
            type: String,
            trim: true,
            required: [true, "answer Option is required"],
        },
        optionC: {
            type: String,
            trim: true,
            required: [true, "answer Option is required"],
        },
        optionD: {
            type: String,
            trim: true,
            required: [true, "answer Option is required"],
        },
        correctAnswer: {
            type: String,
            trim: true,
            required: [true, "answer Option is required"],
        },
        comments:{
            type: String,
            trim: true
        }
        
    },
    { timestamps: true }
);

module.exports = questions = mongoose.model('questions', questionSchema);
