import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  Column,
} from "typeorm";
import { User } from "./User";
import { MClass } from "./MClass";

@Entity("application")
export class Application {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int" })
  userId: number;

  @Column({ type: "int" })
  mclassId: number;

  @ManyToOne("User", "applications")
  @JoinColumn({ name: "userId" })
  user: User;

  @ManyToOne("MClass", "applications")
  @JoinColumn({ name: "mclassId" })
  mclass: MClass;

  @CreateDateColumn()
  createdAt: Date;
}
