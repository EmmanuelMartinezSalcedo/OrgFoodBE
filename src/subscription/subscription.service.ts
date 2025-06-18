import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';
import { Subscription } from './entities/subscription.entity';
import { Bundle } from 'src/bundle/entities/bundle.entity';
import { PaymentMethod } from 'src/payment_method/entities/payment_method.entity';
import { Address } from 'src/address/entities/address.entity';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepo: Repository<Subscription>,

    @InjectRepository(Bundle)
    private readonly bundleRepo: Repository<Bundle>,

    @InjectRepository(Address)
    private readonly addressRepo: Repository<Address>,

    @InjectRepository(PaymentMethod)
    private readonly paymentMethodRepo: Repository<PaymentMethod>,

    private readonly dataSource: DataSource,
  ) {}

  async subscribe(dto: CreateSubscriptionDto) {
    const { addressId, bundleId, paymentMethodId, delivery } = dto;

    const bundle = await this.bundleRepo.findOne({ where: { id: bundleId } });
    if (!bundle) throw new NotFoundException('Bundle not found');

    const address = await this.addressRepo.findOne({
      where: { id: addressId },
    });
    if (!address) throw new NotFoundException('Address not found');

    const paymentMethod = await this.paymentMethodRepo.findOne({
      where: { id: paymentMethodId },
    });
    if (!paymentMethod) throw new NotFoundException('Payment method not found');

    const subscription = this.subscriptionRepo.create({
      bundle,
      bundle_id: bundle.id,
      address,
      address_id: address.id,
      paymentMethod: paymentMethod,
      payment_method_id: paymentMethod.id,
      delivery,
    });

    await this.subscriptionRepo.save(subscription);

    return { message: 'Subscription created successfully' };
  }

  async unsubscribe(id: string) {
    const result = await this.subscriptionRepo.delete(id);

    if (result.affected && result.affected > 0) {
      return { message: 'Subscription deleted successfully' };
    } else {
      throw new NotFoundException('Subscription not found');
    }
  }

  async updateSubscription(id: string, dto: UpdateSubscriptionDto) {
    const subscription = await this.subscriptionRepo.findOne({ where: { id } });
    if (!subscription) throw new NotFoundException('Subscription not found');

    if (dto.addressId) {
      const address = await this.addressRepo.findOne({
        where: { id: dto.addressId },
      });
      if (!address) throw new NotFoundException('Address not found');
      subscription.address_id = address.id;
      subscription.address = address;
    }

    if (dto.paymentMethodId) {
      const paymentMethod = await this.paymentMethodRepo.findOne({
        where: { id: dto.paymentMethodId },
      });
      if (!paymentMethod)
        throw new NotFoundException('Payment method not found');
      subscription.payment_method_id = paymentMethod.id;
      subscription.paymentMethod = paymentMethod;
    }

    if (dto.delivery !== undefined) {
      subscription.delivery = dto.delivery;
    }

    await this.subscriptionRepo.save(subscription);

    return { message: 'Subscription updated successfully' };
  }

  async getByUser(userId: string) {
    const addresses = await this.addressRepo.find({
      where: { user_id: userId },
      select: ['id'],
    });

    if (addresses.length === 0) {
      return { subscriptions: [] };
    }

    const addressIds = addresses.map((a) => a.id);

    const subscriptions = await this.subscriptionRepo.find({
      where: {
        address_id: In(addressIds),
      },
    });

    return { subscriptions };
  }

  async getById(id: string) {
    const subscription = await this.subscriptionRepo.findOne({
      where: { id },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    return subscription;
  }
}
