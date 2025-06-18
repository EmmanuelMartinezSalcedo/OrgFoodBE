import {
  Controller,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  Get,
  NotFoundException,
  UseGuards,
  Put,
  Delete,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UpdateAddressDto } from './dto/update-address.dto';

@ApiTags('Addresses')
@Controller('address')
@UseGuards(AuthGuard('jwt'))
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post(':userId')
  @ApiOperation({ summary: 'Add address to user by userID' })
  create(
    @Param('userId', new ParseUUIDPipe()) userId: string,
    @Body() dto: CreateAddressDto,
  ) {
    return this.addressService.createAddress(userId, dto);
  }

  @Get('all/:userId')
  @ApiOperation({ summary: 'Get all addresses for a user by userID' })
  async findAllByUser(@Param('userId', new ParseUUIDPipe()) userId: string) {
    const addresses = await this.addressService.findAllByUser(userId);
    if (!addresses || addresses.length === 0) {
      throw new NotFoundException('No addresses found for this user');
    }
    return addresses;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an address by ID' })
  async findOneById(@Param('id', new ParseUUIDPipe()) addressId: string) {
    const address = await this.addressService.findOneById(addressId);
    if (!address) {
      throw new NotFoundException('Address not found');
    }
    return address;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an address by ID' })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateAddressDto,
  ) {
    const updated = await this.addressService.update(id, dto);
    if (!updated) throw new NotFoundException('Address not found');
    return updated;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an address by ID' })
  async delete(@Param('id', new ParseUUIDPipe()) id: string) {
    const deleted = await this.addressService.delete(id);
    if (!deleted) throw new NotFoundException('Address not found');
    return { message: 'Address deleted successfully' };
  }
}
