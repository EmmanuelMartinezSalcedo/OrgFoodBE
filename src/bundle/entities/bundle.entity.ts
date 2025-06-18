import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Subscription } from 'src/subscription/entities/subscription.entity';
import { Product } from 'src/product/entities/product.entity';

@Entity()
export class Bundle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  discount_percent: number;

  @Column({ nullable: true })
  image_path?: string;

  @Column({ default: () => 'now()' })
  created_date: Date;

  @OneToMany(() => Subscription, (subscription) => subscription.bundle)
  subscriptions: Subscription[];

  @OneToMany(() => Product, (product) => product.bundle)
  products: Product[];
}
