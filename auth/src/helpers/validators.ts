import joi from 'joi';

const register = joi.object({
    email:          joi.string().trim().required().email().messages({
        'string.empty': `Please enter a valid email!`,
        'string.email': `Please enter a valid email!`,
        'any.required': `Email is a required field`
    }),
    firstName:      joi.string().trim().required().messages({
        'string.empty': `First name cannot be empty!`,
        'any.required': `Please provide a value for first name!`
    }),
    lastName:       joi.string().trim().required().messages({
        'string.empty': `Last name cannot be empty!`,
        'any.required': `Please provide a value for last name!`
    }),
    phoneNumber:    joi.string().pattern(/^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/m).trim().required().messages({
        'string.empty': `Phone number cannot be empty!`,
        'any.required': `Please provide a value for phone number!`,
        "string.pattern.base": "Phone number must be in a valid format, i.e +407########, +373########"
    }),
    password:       joi.string().trim().required().min(6).messages({
        'string.empty': `Password cannot be empty!`,
        'any.required': `Please provide a value for password!`,
        "string.min": "Password must have at least 6 characters",
    }),
    confPassword:   joi.string().trim().required().messages({
        'string.empty': `Confirmation password cannot be empty!`,
        'any.required': `Please provide a value for confirmation password!`
    })
});

const login = joi.object({
    email:          joi.string().trim().required().email().messages({
        'string.empty': `Please enter a valid email!`,
        'string.email': `Please enter a valid email!`,
        'any.required': `Email is a required field`
    }),
    password:       joi.string().trim().required().messages({
        'string.empty': `Password cannot be empty!`,
        'any.required': `Password is a required field!`
    })
});

const validators = {
    register,
    login
};

export default validators;