import {
  Resolver,
  Query,
  Mutation,
  InputType,
  Field,
  Arg,
  Ctx,
  ObjectType
} from "type-graphql";
import { User } from "../entities/User";
import { MyContext } from "../types";
import { validate } from "../utils/validate";
import argon2 from "argon2";
import Joi from "joi";

@InputType()
export class RegisterInput {
  @Field()
  username!: string;

  @Field()
  email!: string;

  @Field()
  password!: string;
}

@InputType()
export class LoginInput {
  @Field()
  username!: string;

  @Field()
  password!: string;
}

/* @ObjectType()
class AuthError {
  @Field(() => String, { nullable: true })
  field: string;

  @Field()
  message: string;
} */

@ObjectType()
class AuthResponse {
  @Field(() => String, { nullable: true })
  error?: String;

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Mutation(() => AuthResponse)
  async register(
    @Arg("data", () => RegisterInput) data: RegisterInput,
    @Ctx() { req, connection }: MyContext
  ): Promise<AuthResponse> {
    const validateError = validate(data);
    if (validateError) {
      return {
        //field: validateError.details[0].path[0],
        error: validateError.details[0].message
      };
    }
    const usernameExists = await connection
      .getRepository(User)
      .findOne({ username: data.username });
    if (usernameExists) {
      return {
        error: "Username already exists"
      };
    }
    const hashedPassword = await argon2.hash(data.password);
    const user = new User();
    user.username = data.username;
    user.email = data.email;
    user.password = hashedPassword;
    connection.manager.save(user);

    //req.session.userId = user.id;
    return { user };
  }

  @Mutation(() => AuthResponse)
  async login(
    @Arg("data", () => LoginInput) data: LoginInput,
    @Ctx() { req, connection }: MyContext
  ): Promise<AuthResponse> {
    /* const error = validate(data);
    if (error) {
      return error.details;
    } */
    const user = await connection
      .getRepository(User)
      .findOne({ username: data.username });
    if (!user) {
      return {
        error: "Invalid username or password"
      };
    }
    const pwValid = await argon2.verify(user.password, data.password);
    if (!pwValid) {
      return {
        error: "Invalid username or password"
      };
    }

    //req.session.userId = user.id;
    return { user };
  }
}
