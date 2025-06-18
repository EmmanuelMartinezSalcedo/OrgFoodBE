import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Subscription } from 'src/subscription/entities/subscription.entity';

@Entity()
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.addresses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: string;

  @Column()
  country: string;

  @Column()
  state: string;

  @Column()
  city: string;

  @Column({ nullable: true })
  postal_code: string;

  @Column()
  line_1: string;

  @Column({ nullable: true })
  line_2: string;

  @Column('int')
  number: number;

  @OneToMany(() => Subscription, (subscription) => subscription.address)
  subscriptions: Subscription[];
}
