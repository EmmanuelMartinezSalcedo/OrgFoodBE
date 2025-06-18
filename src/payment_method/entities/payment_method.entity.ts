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
export class PaymentMethod {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.paymentMethods, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: string;

  @Column()
  card_holder_name: string;

  @Column()
  card_last4: string;

  @Column()
  card_brand: string;

  @Column()
  exp_month: number;

  @Column()
  exp_year: number;

  @OneToMany(() => Subscription, (subscription) => subscription.paymentMethod)
  subscriptions: Subscription[];
}
