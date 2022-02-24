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
import { MyContext } from "../types/context";
import { validate } from "../utils/validate";
import argon2 from "argon2";

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

@ObjectType()
class AuthError {
  @Field(() => String, { nullable: true })
  key: string | number;

  @Field()
  message: string;
}

@ObjectType()
class AuthResponse {
  @Field(() => [AuthError], { nullable: true })
  errors?: AuthError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Mutation(() => AuthResponse)
  async register(
    @Arg("data", () => RegisterInput) data: RegisterInput,
    @Ctx() { db }: MyContext
  ): Promise<AuthResponse> {
    const errors: AuthError[] = [];
    const validateError = validate(data);
    if (validateError) {
      validateError.details.forEach((error) => {
        errors.push({
          key: error.path[0],
          message: error.message
        });
      });
      return { errors };
    }
    const usernameExists = await db
      .getRepository(User)
      .findOne({ username: data.username });
    const emailExists = await db
      .getRepository(User)
      .findOne({ email: data.email });
    if (usernameExists) {
      errors.push({
        key: "username",
        message: "Username already exists"
      });
    }
    if (emailExists) {
      errors.push({
        key: "email",
        message: "Email already exists"
      });
    }
    if (usernameExists || emailExists) return { errors };
    const hashedPassword = await argon2.hash(data.password);
    const user = new User();
    user.username = data.username;
    user.email = data.email;
    user.password = hashedPassword;
    db.manager.save(user);
    return { user };
  }

  @Mutation(() => AuthResponse)
  async login(
    @Arg("data", () => LoginInput) data: LoginInput,
    @Ctx() { req, db }: MyContext
  ): Promise<AuthResponse> {
    const errors: AuthError[] = [];
    const validateError = validate(data);
    if (validateError) {
      validateError.details.forEach((error) => {
        errors.push({
          key: error.path[0],
          message: error.message
        });
      });
      return { errors };
    }
    const user = await db
      .getRepository(User)
      .findOne({ username: data.username });
    if (!user) {
      errors.push({
        key: "username",
        message: "Invalid username"
      });
      return { errors };
    }
    const passValid = await argon2.verify(user.password, data.password);
    if (!passValid) {
      errors.push({
        key: "password",
        message: "Invalid password"
      });
      return { errors };
    }
    req.session.userId = user.id;
    return { user };
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() { req, db }: MyContext): Promise<User | undefined> {
    if (!req.session.userId) return undefined;
    return await db.getRepository(User).findOne({ id: req.session.userId });
  }
}
