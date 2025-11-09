import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private readonly userRepository;
    private readonly jwtService;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        token: string;
        id: string;
        username: string;
        balance: number;
        password?: string;
        roles: string[];
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        bets: import("../bets/entities/bet.entity").Bet[];
    }>;
    login(loginDto: LoginDto): Promise<{
        token: string;
        id: string;
        username: string;
        balance: number;
        password?: string;
        roles: string[];
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        bets: import("../bets/entities/bet.entity").Bet[];
    }>;
    private encryptPassword;
    private getJwtToken;
    private handleException;
}
