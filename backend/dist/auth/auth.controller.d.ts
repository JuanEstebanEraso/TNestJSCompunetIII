import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from './entities/user.entity';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    getProfile(user: User): Promise<{
        user: User;
    }>;
}
