const Joi = require("joi");

const createProductSchema = Joi.object({
  name: Joi.string().trim().min(1).required(),
  description: Joi.string().trim().allow("").optional(),
  price: Joi.number().min(0).required(),
  stock: Joi.number().min(0).optional(),
});

const updateProductSchema = Joi.object({
  name: Joi.string().trim().min(1),
  description: Joi.string().trim().allow(""),
  price: Joi.number().min(0),
  stock: Joi.number().min(0),
})
  .or("name", "description", "price", "stock")
  .messages({
    "object.missing": "At least one field is required for update",
  });

module.exports = {
  createProductSchema,
  updateProductSchema,
};
