const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

const addCourseValidation=(data)=>{

    const Schema = Joi.object({

        name:Joi.string().required(),
        author: Joi.string().required(),
        courseCategory:Joi.objectId().required(),
        duration: Joi.string(),
        courseDescription: Joi.string().required(),
        demoVideo: Joi.number().required(),
        actualPrice:Joi.number().required(),
        discountPrice: Joi.number().required(),
    })
    return Schema.validate(data)
}

module.exports = {
    addCourseValidation,
};