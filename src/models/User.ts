import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from "typeorm";
import { Application } from "./Application";

@Entity("user")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 0 })
  isAdmin: 1 | 0;

  @OneToMany("Application", "user")
  applications: Application[];

  @CreateDateColumn()
  createdAt: Date;
}
