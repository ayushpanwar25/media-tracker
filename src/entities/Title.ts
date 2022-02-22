import { Entity, PrimaryColumn, Column, ManyToMany, JoinTable } from "typeorm";
import { Field, Int, ObjectType } from "type-graphql";
import { User } from "./User";

@ObjectType()
@Entity()
export class Title {
  @Field(() => Int)
  @PrimaryColumn()
  tvdb!: number;

  @Field(() => String)
  @Column()
  imdb!: string;

  @ManyToMany(() => User)
  @JoinTable()
  users: User[];
}
