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
      console.log(req.body);
      // saving new question
      const qns = new questions({
        question: req.body.fieldValues.question,
        optionA: {
          option: req.body.fieldValues.a.option,
          departmentId: req.body.fieldValues.a.departmentId
        },
        optionB: {
          option: req.body.fieldValues.b.option,
          departmentId: req.body.fieldValues.b.departmentId
        },
        optionC: {
          option: req.body.fieldValues.c.option,
          departmentId: req.body.fieldValues.c.departmentId
        },
        optionD: {
          option: req.body.fieldValues.d.option,
          departmentId: req.body.fieldValues.d.departmentId
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

      let departments = {}

      // finding correct answers and making those department's array with question ids
      answers.forEach(async (answer) => {
        let question = allQuestions.find(q => q._id == answer.question_id);
        if (question) {
          if (question.correctAnswer == answer.answer) {
            departments[`question.option${answer.answer}.departmentId`].push(question._id);
          }
        }
      });

      // finding most interested department
      let interestArr = Object.values(departments);
      let maxInterest = Math.max(...interestArr);

      function getKeyByValue(object, value) {
        return Object.keys(object).find(key => object[key] === value);
      }
      let interestedDepartment = getKeyByValue(departments, maxInterest)

      let departmentDetails = await CareerDepartments.findOneAndUpdate({ _id: interestedDepartment }, { $inc: { interestedCount: 1 } });

      // adding the interested department to the user
      await User.updateOne(
        { _id: req.user._id },
        {
          $set: {
            interestedCareerDepartment: interestedDepartment,
            interestedCareerDepartmentName: departmentDetails.departmentName,
          },
        }
      );

      let message = `You are most interested in ${departmentDetails.departmentName} department`;

      return res.json({
        error: false,
        message: "Test submitted successfully",
        data: {
          interestedDepartment: departmentDetails,
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
