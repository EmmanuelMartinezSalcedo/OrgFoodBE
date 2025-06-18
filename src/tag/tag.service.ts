import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepo: Repository<Tag>,
  ) {}

  async create(dto: CreateTagDto) {
    const tag = this.tagRepo.create(dto);
    await this.tagRepo.save(tag);
    return { message: 'Tag created successfully' };
  }

  async update(id: string, dto: UpdateTagDto) {
    const tag = await this.tagRepo.findOne({ where: { id } });
    if (!tag) throw new NotFoundException('Tag not found');

    Object.assign(tag, dto);
    await this.tagRepo.save(tag);
    return { message: 'Tag updated successfully' };
  }

  async findAll() {
    return this.tagRepo.find();
  }

  async findOne(id: string) {
    const tag = await this.tagRepo.findOne({ where: { id } });
    if (!tag) throw new NotFoundException('Tag not found');
    return tag;
  }
}
