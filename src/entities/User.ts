import {
    Entity,
    PrimaryGeneratedColumn,
    Column, ManyToMany, JoinTable
} from "typeorm";
import { Title } from "./Title";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username!: string;

    @Column({ unique: true })
    email!: string;

    @Column()
    password!: string;

    @ManyToMany(() => Title)
    @JoinTable()
    titles: Title[];
}