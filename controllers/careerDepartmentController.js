const User = require("../models/user");
const CareerDepartmentSchema = require("../models/careerDepartments");

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

            // saving new department
            const newDepartment = new CareerDepartmentSchema({
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
};