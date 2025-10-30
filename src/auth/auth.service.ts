import { 
  Injectable, 
  UnauthorizedException, 
  ConflictException,
  InternalServerErrorException,
  NotFoundException 
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { password, ...userData } = registerDto;
    
    try {
      const user = this.userRepository.create({
        ...userData,
        password: this.encryptPassword(password),
        roles: registerDto.roles ?? ['user'],
      });

      await this.userRepository.save(user);
      delete user.password;

      return {
        ...user,
        token: this.getJwtToken({ id: user.id, username: user.username, roles: user.roles }),
      };
    } catch (error) {
      this.handleException(error);
    }
  }

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;
    
    const user = await this.userRepository.findOne({
      where: { username },
      select: { 
        id: true, 
        username: true, 
        password: true, 
        roles: true, 
        isActive: true,
        balance: true 
      },
    });

    if (!user) {
      throw new NotFoundException(`Usuario ${username} no encontrado`);
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    if (!bcrypt.compareSync(password, user.password!)) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }

    delete user.password;

    return {
      ...user,
      token: this.getJwtToken({ id: user.id, username: user.username, roles: user.roles }),
    };
  }

  private encryptPassword(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  private getJwtToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload);
  }

  private handleException(error: any): never {
    if (error.code === '23505') {
      throw new ConflictException('El nombre de usuario ya existe');
    }
    throw new InternalServerErrorException('Error al crear el usuario');
  }
}

