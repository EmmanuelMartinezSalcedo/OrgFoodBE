import { Module } from '@nestjs/common';
import { PaymentMethodController } from './payment_method.controller';
import { PaymentMethodService } from './payment_method.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { PaymentMethod } from './entities/payment_method.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentMethod]), UserModule],
  controllers: [PaymentMethodController],
  providers: [PaymentMethodService],
  exports: [PaymentMethodService],
})
export class PaymentMethodModule {}
