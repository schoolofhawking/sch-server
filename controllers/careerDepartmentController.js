const User = require("../models/user");
const CareerDepartment = require("../models/careerDepartments");

const {
    addCareerDepartmentValidation
} = require("../validations/careerDepartment/careerDepartmentValidation");

//  signup
module.exports = {
    addDepartment: async (req, res) => {
        try {
            // body validation
            const dataValidation = await addCareerDepartmentValidation(req.body);

            if (dataValidation.error) {
                const message = dataValidation.error.details[0].message.replace(/"/g, "");
                return res.json({
                    error: true,
                    message: message,
                });
            }

            // department count validation
            let allDepartments = await CareerDepartment.find();
            if (allDepartments.length >= 4) {
                return res.json({
                    error: true,
                    message: "You can add only 4 departments",
                });
            }

            // saving new department
            const newDepartment = new CareerDepartment({
                departmentName: req.body.departmentName,
                description: req.body.description,
            });

            await newDepartment.save();

            return res.json({
                error: false,
                message: "Department added successfully",
            });
        } catch (err) {
            return res.json({
                error: true,
                message: "something went wrong",
                data: err + "",
            });
        }
    },

    // get all departments
    getCareerDepartments: async (req, res) => {
        try {
            let allDepartments = await CareerDepartment.aggregate([
                {
                    $project: {
                        departmentName: 1,
                    }
                }
            ]);

            return res.json({
                error: false,
                message: "Career departments fetched successfully",
                data: allDepartments,
            });
        } catch (err) {
            return res.json({
                error: true,
                message: "something went wrong",
                data: err + "",
            });
        }
    },
};