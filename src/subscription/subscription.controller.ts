import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Subscriptions')
@Controller('subcscription')
@UseGuards(AuthGuard('jwt'))
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post('subscribe')
  @ApiOperation({
    summary: 'Subscribe to a bundle',
  })
  async subscribe(@Body() dto: CreateSubscriptionDto) {
    return this.subscriptionService.subscribe(dto);
  }

  @Delete('unsubscribe/:id')
  @ApiOperation({ summary: 'Unsubscribe by ID' })
  async unsubscribe(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.subscriptionService.unsubscribe(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update a subscription',
  })
  async updateSubscription(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateSubscriptionDto,
  ) {
    return this.subscriptionService.updateSubscription(id, dto);
  }

  @Get('user/:userId')
  @ApiOperation({
    summary: 'Get a user subscriptions by userID',
  })
  async getByUser(@Param('userId', new ParseUUIDPipe()) userId: string) {
    return this.subscriptionService.getByUser(userId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a subscription by ID',
  })
  async getById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.subscriptionService.getById(id);
  }
}
