import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from "typeorm";
import { User } from "./User";

@Entity("mclass")
export class MClass {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  mclassCode: string;

  @Column()
  title: string;

  @Column({ type: "text", nullable: true })
  description: string | null;

  @Column()
  maxParticipants: number;

  @Column()
  appliedParticipants: number;

  @Column()
  hostId: number;

  @Column()
  startAt: Date;

  @Column()
  endAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: "hostId" })
  host: User;

  @OneToMany("Application", "mclass")
  applications: any[];
}
