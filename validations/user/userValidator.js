const Joi = require('joi')


const loginValidation=(data)=>{

    const Schema = Joi.object({

        email:Joi.string().required().email({minDomainSegments:2,tlds:{allow:['com','net']}}),
        password: Joi.string()
            .required()
            .label("Password")
            .min(6)
            .max(30)
            .messages({ "string.pattern.name": "Invalid password" }),

    })
    return Schema.validate(data)
}




const signupValidation = (data) => {
    const Schema = Joi.object({
        fullName: Joi.string()
            .required()
            .label("Fullname")
            .messages({ "string.pattern.name": "Invalid fullname." }),
        email: Joi.string().required()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
        password: Joi.string()
            .required()
            .label("Password")
            .min(6)
            .max(30)
            .messages({ "string.pattern.name": "Invalid password" }),
        phoneNumber: Joi.string().min(10).required().label("phone number")
    })

    return Schema.validate(data)

}

const profileUpdateValidation = (data) => {
    const Schema = Joi.object({
        fullName: Joi.string()
            .required()
            .label("Fullname")
            .messages({ "string.pattern.name": "Invalid fullname." }),
        email: Joi.string().required()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
        country: Joi.string().required().invalid('-').label("Country"),
        state: Joi.string().required().invalid('-').label("State"),
        city: Joi.string().required().invalid('-').label("City"),
        designation: Joi.string().invalid('-').required().label("Designation"),
        qualification: Joi.string().invalid('-').required().label("Qualification"),
        phoneNumber: Joi.string().min(10).required().label("phone number")
    })

    return Schema.validate(data)
}

module.exports = {
    signupValidation,
    loginValidation,
    profileUpdateValidation
};
