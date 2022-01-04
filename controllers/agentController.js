const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AWS = require("aws-sdk");
const agent = require("../models/referalAgents");
const { promisify } = require("util");
const questions = require("../models/questions");

//  signup
module.exports = {
  addNewAgent: async (req, res) => {
    try {
      console.log("sfa", req.body);

      const newAgent = new agent({
        fullName: req.body.fieldValues.name,
        phoneNumber: req.body.fieldValues.phone,
        place: req.body.fieldValues.place,
      });
      let saved = await newAgent.save();

      console.log("__", newAgent);
      let url = newAgent._id;
      return res.json({
        error: false,
      });
    } catch (err) {
      console.log(err);
      return res.json({
        error: true,
      });
    }
  },
  getAllagents: async (req, res) => {
    try {
      console.log("sfa", req.body);
      let data = await agent.find({});

      return res.json({
        error: false,
        data: data,
      });
    } catch (err) {
      console.log(err);
      return res.json({
        error: true,
      });
    }
  },
  updateUsers: async (id) => {
    console.log("!!!!!!!!!!!!", id);
    try {
      await referalAgents.findOneAndUpdate(
        { _id: id },
        { $inc: { usersJoined: 1 } }
      );

      return 0;
    } catch (err) {
      console.log(err);
      return res.json({
        error: true,
      });
    }
  },
};
