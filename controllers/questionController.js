const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AWS = require('aws-sdk')

const { promisify } = require('util');
const questions = require("../models/questions");


//  signup
module.exports = {


    getAllQuestions: async (req, res) => {

        try {
            let data = await questions.find({})

            return res.json({
                data: data,
                error: false
            });

        }
        catch (err) {
            return res.json({
                error: true,
                message: "something wnt wrong"
            });
        }
    },

    addNewQuestion: async (req, res) => {

        console.log(req.body);
        //register
        const qns = new questions({
            question: req.body.fieldValues.question,
            optionA: req.body.fieldValues.a,
            optionB: req.body.fieldValues.b,
            optionC: req.body.fieldValues.c,
            optionD: req.body.fieldValues.d,
            correctAnswer: req.body.fieldValues.rightAnswer,
            comments: req.body.fieldValues.comments,
        });
        let saved = await qns.save();

        return res.json({
            error: false
        })
    }

};
