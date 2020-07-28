import { TaskStatus } from './task-status.enum';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { User } from '../auth/user.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: TaskStatus;

  @ManyToOne(
    () => User,
    user => user.tasks,
    { eager: false },
  )
  @Exclude({ toPlainOnly: true })
  user: User;

  @Column()
  @Exclude({ toPlainOnly: true })
  userId: string;
}
