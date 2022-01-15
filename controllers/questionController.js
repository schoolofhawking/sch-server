const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AWS = require("aws-sdk");
const { promisify } = require("util");

const questions = require("../models/questions");
const CareerDepartments = require('../models/careerDepartments');

const {
  submitTestValidation
} = require("../validations/question/submitTestValidation");

//  signup
module.exports = {
  getAllQuestions: async (req, res) => {
    try {
      let data = await questions.find({});

      return res.json({
        data: data,
        error: false,
      });
    } catch (err) {
      return res.json({
        error: true,
        message: "something wnt wrong",
      });
    }
  },

  getActiveQuestions: async (req, res) => {
    try {
      let data = await questions.find({ isActive: true });
      console.log(data);

      let response = {}

      return res.json({
        data: data,
        error: false,
      });
    } catch (err) {
      return res.json({
        error: true,
        message: "something went wrong",
        data: err + "",
      });
    }
  },

  addNewQuestion: async (req, res) => {
    try {
      console.log('question body___:', req.body);
      // saving new question
      const qns = new questions({
        question: req.body.fieldValues.question,
        optionA: {
          option: req.body.fieldValues.a,
          departmentId: req.body.fieldValues.departmentA
        },
        optionB: {
          option: req.body.fieldValues.b,
          departmentId: req.body.fieldValues.departmentB
        },
        optionC: {
          option: req.body.fieldValues.c,
          departmentId: req.body.fieldValues.departmentC
        },
        optionD: {
          option: req.body.fieldValues.d,
          departmentId: req.body.fieldValues.departmentD
        },
        correctAnswer: req.body.fieldValues.rightAnswer,
        comments: req.body.fieldValues.comments,
      });
      let saved = await qns.save();

      return res.json({
        error: false,
        data: saved,
      });
    }
    catch (err) {
      return res.json({
        error: true,
        message: "something wnt wrong",
        data: err + "",
      });
    }
  },

  activateOrDeactivateQuestion: async (req, res) => {
    try {
      if (!req.body.id && !req.body.isActive) {
        return res.json({
          error: true,
          message: "id and isActive is required",
        });
      }

      await questions.updateOne(
        { _id: req.body.id },
        {
          isActive: req.body.isActive,
        }
      );

      return res.json({
        error: false,
        message: "Question updated successfully",
      });
    } catch (err) {
      return res.json({
        error: true,
        message: "something wnt wrong",
        data: err + "",
      });
    }
  },

  submitTest: async (req, res) => {
    try {
      // body validation
      console.log('submit test body:', req.body);
      const dataValidation = await submitTestValidation(req.body);

      if (dataValidation.error) {
        const message = dataValidation.error.details[0].message.replace(/"/g, "");
        return res.json({
          error: true,
          message: message,
        });
      }

      let answers = req.body.answers;


      // fetching all active questions
      let allQuestions = await questions.find({ isActive: true });

      let departments = {};
      let totalCorrectAnswers = 0;


      // finding correct answers and increasing those department's count
      answers.forEach((answer) => {
        let question = allQuestions.find(q => q._id == answer.question_id);
        if (question) {
          console.log('question_found:', question);
          if (question.correctAnswer == answer.answer) {
            let departmentOfThisQuestion = ''

            if (question.correctAnswer == 'A') {
              departmentOfThisQuestion = question.optionA.departmentId
            } else if (question.correctAnswer == 'B') {
              departmentOfThisQuestion = question.optionB.departmentId
            } else if (question.correctAnswer == 'C') {
              departmentOfThisQuestion = question.optionC.departmentId
            } else if (question.correctAnswer == 'D') {
              departmentOfThisQuestion = question.optionD.departmentId
            }

            totalCorrectAnswers++

            console.log('departmentOfThisQuestion:', departmentOfThisQuestion);

            if (departments[departmentOfThisQuestion]) {
              departments[departmentOfThisQuestion] += 1;
            } else {
              console.log('in else of departmentOfThisQuestion:', departments);
              departments[departmentOfThisQuestion] = 1;
              console.log('in after of departmentOfThisQuestion:', departments);

            }
          }
        }
      });


      // finding most interested department
      let departmentDetails = '';

      if (totalCorrectAnswers > 0) {
        console.log('in if',departments);
        let interestArr = Object.values(departments);
        let maxInterest = Math.max(...interestArr);

        function getKeyByValue(object, value) {
          return Object.keys(object).find(key => object[key] === value);
        }

        let interestedDepartment = getKeyByValue(departments, maxInterest)

        departmentDetails = await CareerDepartments.findOneAndUpdate({ _id: interestedDepartment }, { $inc: { interestedCount: 1 } });
      } 
      // no correct answers
      else {
        departmentDetails = await CareerDepartments.findOne({ isDefault: true });
      }


      // adding the interested department to the user
      await User.updateOne(
        { _id: req.user._id },
        {
          $set: {
            interestedCareerDepartment: departmentDetails._id,
            interestedCareerDepartmentName: departmentDetails.departmentName,
          },
        }
      );

      let message = `You are most interested in ${departmentDetails.departmentName} category`;

      return res.json({
        error: false,
        message: "Test submitted successfully",
        data: {
          message
        },
      });
    } catch (err) {
      return res.json({
        error: true,
        message: "something wnt wrong",
        data: err + "",
      });
    }
  }
};
