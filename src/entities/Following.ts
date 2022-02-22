import { Entity, PrimaryColumn, Column } from "typeorm";
import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class Following {
  @Field(() => Int)
  @PrimaryColumn()
  tvdb!: number;

  @Field(() => Int)
  @Column()
  userid!: number;
}
