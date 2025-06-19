import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Bundle } from 'src/bundle/entities/bundle.entity';

@Entity('rating_bundle')
@Unique('unique_user_bundle_rating', ['user_id', 'bundle_id'])
export class RatingBundle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: string;

  @ManyToOne(() => Bundle, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bundle_id' })
  bundle: Bundle;

  @Column()
  bundle_id: string;

  @Column({ nullable: true })
  comment?: string;

  @Column({ nullable: true })
  rating?: number;

  @Column({ default: () => 'now()' })
  created_at: Date;
}
