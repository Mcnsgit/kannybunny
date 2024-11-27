const Joi = require('joi');
const { ValidationError } = require('../utils/ErrorHandler');

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const validationError = new ValidationError('Validation failed');
      error.details.forEach((detail) => {
        validationError.addValidationError(detail.path[0], detail.message);
      });
      return next(validationError);
    }
    next();
  };
};

// Common validation schemas
const schemas = {
  board: Joi.object({
    title: Joi.string().required().min(3).max(100),
    description: Joi.string().allow('').max(500),
  }),

  list: Joi.object({
    title: Joi.string().required().min(1).max(100),
    boardId: Joi.string().required(),
    position: Joi.number().min(0)
  }),

  task: Joi.object({
    title: Joi.string().required().min(1).max(100),
    description: Joi.string().allow('').max(500),
    listId: Joi.string().required(),
    position: Joi.number().min(0),
    priority: Joi.string().valid('low', 'medium', 'high')
  })
};

module.exports = {
  validateRequest,
  schemas
};
