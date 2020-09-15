import Joi from 'joi';

import {
  LOGIN_MIN_LENGTH,
  LOGIN_MAX_LENGTH,
  MIN_AGE,
  MAX_AGE,
  MIN_PASSWORD_LENGTH,
  MAX_PASSWORD_LENGTH,
  RASSWORD_ERROR,
  MIN_NAME_LENGTH,
  MAX_NAME_LENGTH,
} from '../constants';

export const userSchema = Joi.object({
  login: Joi.string().alphanum().min(LOGIN_MIN_LENGTH).max(LOGIN_MAX_LENGTH).required(),
  password: Joi.string()
    .pattern(new RegExp('^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{6,}$'))
    .min(MIN_PASSWORD_LENGTH)
    .max(MAX_PASSWORD_LENGTH)
    .required()
    .messages({
      'string.pattern.base': RASSWORD_ERROR,
    }),
  age: Joi.number().integer().min(MIN_AGE).max(MAX_AGE).required(),
});

export const groupSchema = Joi.object({
  name: Joi.string().min(MIN_NAME_LENGTH).max(MAX_NAME_LENGTH).required(),
  permissions: Joi.array().items('READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES'),
});
