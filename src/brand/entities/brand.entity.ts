import { Social } from 'src/social/entities/social.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Brand {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  image_path?: string;

  @Column({ default: () => 'now()' })
  created_date: Date;

  @OneToMany(() => Social, (social) => social.brand, { cascade: true })
  socials: Social[];
}
