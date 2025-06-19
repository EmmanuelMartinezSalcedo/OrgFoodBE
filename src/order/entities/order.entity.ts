import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { OrderRow } from 'src/order/entities/order_row.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
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
  postal_code?: string;

  @Column()
  line_1: string;

  @Column({ nullable: true })
  line_2?: string;

  @Column()
  number: string;

  @Column({ type: 'timestamp' })
  delivery: Date;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => OrderRow, (orderRow) => orderRow.order, {
    cascade: true,
    eager: true,
  })
  order_rows: OrderRow[];
}
