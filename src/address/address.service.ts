import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { Repository } from 'typeorm';
import { CreateAddressDto } from './dto/create-address.dto';
import { User } from 'src/user/entities/user.entity';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepo: Repository<Address>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async createAddress(userId: string, dto: CreateAddressDto) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const existingAddresses = await this.addressRepo.count({
      where: { user_id: userId },
    });

    if (existingAddresses >= 3) {
      throw new BadRequestException('User cannot have more than 3 addresses');
    }

    const address = this.addressRepo.create({ ...dto, user_id: userId });
    await this.addressRepo.save(address);

    return { message: 'Address created successfully' };
  }

  async findAllByUser(userId: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['addresses'],
    });

    if (!user) throw new NotFoundException('User not found');
    return user.addresses;
  }

  async findOneById(id: string) {
    return this.addressRepo.findOne({ where: { id } });
  }

  async update(id: string, dto: UpdateAddressDto) {
    const address = await this.findOneById(id);
    if (!address) {
      return { message: 'Address not found' };
    }

    Object.assign(address, dto);
    await this.addressRepo.save(address);
    return { message: 'Address updated successfully' };
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.addressRepo.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
