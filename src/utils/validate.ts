import Joi from "joi";
import { RegisterInput } from "../resolvers/UserResolver";

const schema = Joi.object({
  username: Joi.string().alphanum().min(5).max(20).required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  password: Joi.string().required()
});

export const validate = (data: RegisterInput) => schema.validate(data).error;
