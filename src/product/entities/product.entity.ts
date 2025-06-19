import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Bundle } from 'src/bundle/entities/bundle.entity';
import { Brand } from 'src/brand/entities/brand.entity';
import { randomBytes } from 'crypto';
import { Category } from 'src/category/entities/category.entity';
import { Tag } from 'src/tag/entities/tag.entity';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  sku: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  unit: string;

  @Column({ nullable: true })
  discount_percent?: number;

  @ManyToOne(() => Bundle, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'bundle_id' })
  bundle: Bundle | null;

  @Column({ nullable: true })
  bundle_id: string | null;

  @ManyToOne(() => Brand, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;

  @Column()
  brand_id: string;

  @Column({ nullable: true })
  image_path?: string;

  @Column({ default: () => 'now()' })
  created_date: Date;

  @BeforeInsert()
  generateSku() {
    this.sku = 'SKU-' + randomBytes(4).toString('hex').toUpperCase();
  }

  @ManyToMany(() => Category, (category) => category.products)
  @JoinTable({
    name: 'product_category',
    joinColumn: { name: 'product_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
  })
  categories: Category[];

  @ManyToMany(() => Tag, (tag) => tag.products)
  @JoinTable({
    name: 'product_tag',
    joinColumn: { name: 'product_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags: Tag[];

  @ManyToMany(() => User, (user) => user.favoriteProducts)
  favoritedByUsers: User[];
}
