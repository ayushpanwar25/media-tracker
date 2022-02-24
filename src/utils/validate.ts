import Joi from "joi";
import { RegisterInput, LoginInput } from "../resolvers/UserResolver";

const schema = Joi.object({
  username: Joi.string().alphanum().min(5).max(20).required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  password: Joi.string().required() //add regex
});

export const validate = (data: RegisterInput | LoginInput) =>
  schema.validate(data, { abortEarly: false }).error;
