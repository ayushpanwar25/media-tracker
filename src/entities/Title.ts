import {
    Entity,
    PrimaryColumn,
    Column
} from "typeorm";
import {Field, Int, ObjectType} from "type-graphql";

@ObjectType()
@Entity()
export class Title {
    @Field(() => Int)
    @PrimaryColumn()
    tvdb!: number;

    @Field(() => String)
    @Column()
    imdb!: string;
}