import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentMethod } from './entities/payment_method.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { CreatePaymentMethodDto } from './dto/create-payment_method.dto';

@Injectable()
export class PaymentMethodService {
  constructor(
    @InjectRepository(PaymentMethod)
    private readonly paymentMethodRepo: Repository<PaymentMethod>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async createPaymentMethod(userId: string, dto: CreatePaymentMethodDto) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const existingPaymentMethodes = await this.paymentMethodRepo.count({
      where: { user_id: userId },
    });

    if (existingPaymentMethodes >= 3) {
      throw new BadRequestException(
        'User cannot have more than 3 payment methodes',
      );
    }

    const paymentMethod = this.paymentMethodRepo.create({
      ...dto,
      user_id: userId,
    });
    await this.paymentMethodRepo.save(paymentMethod);

    return { message: 'Payment method created successfully' };
  }

  async findAllByUser(userId: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['paymentMethods'],
    });

    if (!user) throw new NotFoundException('User not found');
    return user.paymentMethods;
  }

  async findOneById(id: string) {
    return this.paymentMethodRepo.findOne({ where: { id } });
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.paymentMethodRepo.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
