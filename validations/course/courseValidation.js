const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

const addCourseValidation=(data)=>{

    const Schema = Joi.object({

        name:Joi.string().required(),
        author: Joi.string().required(),
        // category:Joi.objectId().required(),
        duration: Joi.string(),
        description: Joi.string().required(),
        actualPrice:Joi.number().required(),
        discountPrice: Joi.number().required(),
    })
    return Schema.validate(data)
}

module.exports = {
    addCourseValidation,
};