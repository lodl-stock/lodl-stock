import joi from 'joi';

const subscriptionCreate = joi.object({
    type:           joi.string().required().trim().valid('PRICE_BELOW', 'STOCK_BELOW'),
    treshold:       joi.number().positive().messages({
        'any.required': `Please provide a value for points`,
        'number.positive': `Alert treshold should be a positive number`
    }),
    userId:         joi.string().required().trim().messages({
        'string.empty': `User id cannot be empty!`,
        'any.required': `Please provide a value for User id!`
    }),
    productId:      joi.string().required().trim().messages({
        'string.empty': 'User id cannot be empty!',
        'any.required': `Please provide a value for User id!`
    }),
});

const validators = {
    subscriptionCreate
};

export default validators
