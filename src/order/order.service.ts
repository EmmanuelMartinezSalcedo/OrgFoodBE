import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderRow } from 'src/order/entities/order_row.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,

    @InjectRepository(OrderRow)
    private orderRowRepo: Repository<OrderRow>,

    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async create(dto: CreateOrderDto) {
    const user = await this.userRepo.findOne({ where: { id: dto.user_id } });
    if (!user) throw new NotFoundException('User not found');

    const order = this.orderRepo.create({
      ...dto,
      delivery: new Date(dto.delivery),
    });

    order.order_rows = dto.order_rows.map((row) =>
      this.orderRowRepo.create({
        product_id: row.product_id,
        quantity: row.quantity,
      }),
    );

    await this.orderRepo.save(order);
    return { message: 'Order created successfully' };
  }

  async cancelOrder(id: string) {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');

    const now = new Date();
    const deliveryDate = new Date(order.delivery);

    if (deliveryDate <= now) {
      throw new BadRequestException('Cannot cancel order after delivery date');
    }

    await this.orderRepo.remove(order);

    return { message: 'Order cancelled successfully' };
  }

  async getOrdersByUser(userId: string) {
    return this.orderRepo.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });
  }
}
