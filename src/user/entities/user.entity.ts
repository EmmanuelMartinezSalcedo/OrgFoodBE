import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Address } from '../../address/entities/address.entity';
import { PaymentMethod } from 'src/payment_method/entities/payment_method.entity';
import { Bundle } from 'src/bundle/entities/bundle.entity';
import { Product } from 'src/product/entities/product.entity';

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

  @ManyToMany(() => Bundle, (bundle) => bundle.users)
  @JoinTable({
    name: 'user_bundle',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'bundle_id', referencedColumnName: 'id' },
  })
  bundles: Bundle[];

  @ManyToMany(() => Product, (product) => product.favoritedByUsers)
  @JoinTable({
    name: 'favorite_product',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'product_id', referencedColumnName: 'id' },
  })
  favoriteProducts: Product[];

  @ManyToMany(() => Bundle, (bundle) => bundle.favoritedByUsers)
  @JoinTable({
    name: 'favorite_bundle',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'bundle_id', referencedColumnName: 'id' },
  })
  favoriteBundles: Bundle[];
}
