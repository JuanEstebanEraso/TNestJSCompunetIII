import { 
  Injectable, 
  NotFoundException, 
  BadRequestException,
  ConflictException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const existingUser = await this.userRepository.findOne({
        where: { username: createUserDto.username },
      });

      if (existingUser) {
        throw new ConflictException(`El nombre de usuario '${createUserDto.username}' ya está en uso`);
      }

      const user = this.userRepository.create({
        ...createUserDto,
        balance: createUserDto.balance ?? 10000,
      });

      return await this.userRepository.save(user);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Error al crear el usuario');
    }
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      relations: ['bets'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['bets', 'bets.event'],
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID '${id}' no encontrado`);
    }

    return user;
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { username },
      relations: ['bets', 'bets.event'],
    });

    if (!user) {
      throw new NotFoundException(`Usuario '${username}' no encontrado`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.username) {
      const existingUser = await this.userRepository.findOne({
        where: { username: updateUserDto.username },
      });

      if (existingUser && existingUser.id !== id) {
        throw new ConflictException(`El nombre de usuario '${updateUserDto.username}' ya está en uso`);
      }
    }

    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

  async updateBalance(id: string, amount: number): Promise<User> {
    const user = await this.findOne(id);
    
    if (user.balance + amount < 0) {
      throw new BadRequestException('Saldo insuficiente');
    }

    user.balance = Number(user.balance) + amount;
    return await this.userRepository.save(user);
  }

  async getUserBalance(id: string): Promise<number> {
    const user = await this.findOne(id);
    return Number(user.balance);
  }
}
