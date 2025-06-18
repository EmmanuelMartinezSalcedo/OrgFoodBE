import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Bundle } from 'src/bundle/entities/bundle.entity';
import { Address } from 'src/address/entities/address.entity';
import { PaymentMethod } from 'src/payment_method/entities/payment_method.entity';

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Bundle, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bundle_id' })
  bundle: Bundle;

  @Column()
  bundle_id: string;

  @ManyToOne(() => Address, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'address_id' })
  address: Address;

  @Column()
  address_id: string;

  @ManyToOne(() => PaymentMethod, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'payment_method_id' })
  paymentMethod: PaymentMethod;

  @Column()
  payment_method_id: string;

  @Column({ type: 'int' })
  delivery: number;
}
