import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from './entities/subscription.entity';
import { PaymentMethodModule } from 'src/payment_method/payment_method.module';
import { BundleModule } from 'src/bundle/bundle.module';
import { AddressModule } from 'src/address/address.module';
import { Bundle } from 'src/bundle/entities/bundle.entity';
import { Address } from 'src/address/entities/address.entity';
import { PaymentMethod } from 'src/payment_method/entities/payment_method.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subscription, Bundle, Address, PaymentMethod]),
    PaymentMethodModule,
    BundleModule,
    AddressModule,
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
