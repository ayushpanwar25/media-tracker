import { ObjectType, Field } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@ObjectType()
@Entity()
export class User {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ unique: true })
  username!: string;

  @Field()
  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Field()
  @Column({nullable: true})
  plexToken?: string;

  @Field()
  @Column({nullable: true})
  serverUri?: string;

  @Field()
  @Column({nullable: true})
  sonarrToken?: string;
}
