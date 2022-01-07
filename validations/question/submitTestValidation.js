const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

const submitTestValidation = (data) => {
    const answerObjSchema = Joi.object({
        question_id: Joi.string().required(),
        answer: Joi.string().required().valid('A','B','C','D'),
    })

    const Schema = Joi.object({
        answers: Joi.array().items(answerObjSchema).required(),
    })

    return Schema.validate(data)
}

module.exports = {
    submitTestValidation,
};