const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

const addCareerDepartmentValidation=(data)=>{
    const Schema = Joi.object({
        departmentName:Joi.string().required(),
        description:Joi.string().required(),
    })

    return Schema.validate(data)
}

module.exports = {
    addCareerDepartmentValidation,
};