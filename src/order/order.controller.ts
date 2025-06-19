import {
  Controller,
  Post,
  Body,
  UseGuards,
  Delete,
  Param,
  ParseUUIDPipe,
  Get,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Orders')
@Controller('orders')
@UseGuards(AuthGuard('jwt'))
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  async create(@Body() dto: CreateOrderDto) {
    return this.orderService.create(dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Cancel an order by ID' })
  async cancelOrder(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.orderService.cancelOrder(id);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get all orders for a user by userID' })
  async getOrdersByUser(@Param('userId', new ParseUUIDPipe()) userId: string) {
    return this.orderService.getOrdersByUser(userId);
  }
}
