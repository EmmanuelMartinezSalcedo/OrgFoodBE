import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Address } from '../../address/entities/address.entity';
import { PaymentMethod } from 'src/payment_method/entities/payment_method.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  lastname: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  gender: string;

  @Column({ nullable: true })
  birthdate?: Date;

  @Column({ nullable: true, unique: true })
  phone_number?: string;

  @Column({ nullable: true })
  image_path?: string;

  @Column()
  newsletter_subscribed: boolean;

  @OneToMany(() => Address, (address) => address.user, { cascade: true })
  addresses: Address[];

  @OneToMany(() => PaymentMethod, (paymentMethod) => paymentMethod.user, {
    cascade: true,
  })
  paymentMethods: PaymentMethod[];
}
