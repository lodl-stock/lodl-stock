import joi from 'joi';

const subscriptionCreate = joi.object({
    type:           joi.string().required().trim().valid('PRICE_BELOW', 'STOCK_BELOW'),
    treshold:       joi.number().positive().messages({
        'any.required': `Please provide a value for treshold`,
        'number.positive': `Alert treshold should be a positive number`
    }),
    userId:         joi.number().positive().messages({
        'any.required': `Please provide a value for user id`,
        'number.positive': `Alert treshold should be a positive number`
    }),
    storeProductId: joi.number().positive().messages({
        'any.required': `Please provide a value for product id`,
        'number.positive': `Alert treshold should be a positive number`
    }),
});

const validators = {
    subscriptionCreate
};

export default validators
