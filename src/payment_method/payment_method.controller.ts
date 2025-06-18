import {
  Controller,
  Post,
  Param,
  Body,
  ParseUUIDPipe,
  Get,
  NotFoundException,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PaymentMethodService } from './payment_method.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreatePaymentMethodDto } from './dto/create-payment_method.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Payment Methods')
@Controller('payment-method')
@UseGuards(AuthGuard('jwt'))
export class PaymentMethodController {
  constructor(private readonly paymentMethodService: PaymentMethodService) {}

  @Post(':userId')
  @ApiOperation({ summary: 'Add paymentMethod to user by userID' })
  create(
    @Param('userId', new ParseUUIDPipe()) userId: string,
    @Body() dto: CreatePaymentMethodDto,
  ) {
    return this.paymentMethodService.createPaymentMethod(userId, dto);
  }

  @Get('all/:userId')
  @ApiOperation({ summary: 'Get all payment methods for a user by userID' })
  async findAllByUser(@Param('userId', new ParseUUIDPipe()) userId: string) {
    const paymentMethods =
      await this.paymentMethodService.findAllByUser(userId);
    if (!paymentMethods || paymentMethods.length === 0) {
      throw new NotFoundException('No payment methods found for this user');
    }
    return paymentMethods;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an payment method by ID' })
  async findOneById(@Param('id', new ParseUUIDPipe()) paymentMethodId: string) {
    const paymentMethod =
      await this.paymentMethodService.findOneById(paymentMethodId);
    if (!paymentMethod) {
      throw new NotFoundException('Payment method not found');
    }
    return paymentMethod;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a payment method by ID' })
  async delete(@Param('id', new ParseUUIDPipe()) id: string) {
    const deleted = await this.paymentMethodService.delete(id);
    if (!deleted) throw new NotFoundException('Payment method not found');
    return { message: 'Payment method deleted successfully' };
  }
}
