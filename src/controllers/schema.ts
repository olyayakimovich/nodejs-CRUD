import Joi from 'joi';

import {
  LOGIN_MIN_LENGTH,
  LOGIN_MAX_LENGTH,
  MIN_AGE,
  MAX_AGE,
  MIN_PASSWORD_LENGTH,
  MAX_PASSWORD_LENGTH,
} from '../constants';

export default Joi.object({
  login: Joi.string().alphanum().min(LOGIN_MIN_LENGTH).max(LOGIN_MAX_LENGTH).required(),
  password: Joi.string().min(MIN_PASSWORD_LENGTH).max(MAX_PASSWORD_LENGTH).required(),
  age: Joi.number().integer().min(MIN_AGE).max(MAX_AGE).required(),
});
