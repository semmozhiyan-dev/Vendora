"use strict";

const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string().trim().min(1).max(100).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 1 character",
    "string.max": "Name cannot exceed 100 characters",
  }),
  email: Joi.string().email().lowercase().trim().required().messages({
    "string.email": "Please provide a valid email address",
    "string.empty": "Email is required",
  }),
  password: Joi.string().min(6).max(128).required().messages({
    "string.min": "Password must be at least 6 characters long",
    "string.max": "Password cannot exceed 128 characters",
    "string.empty": "Password is required",
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required().messages({
    "string.email": "Please provide a valid email address",
    "string.empty": "Email is required",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
};
