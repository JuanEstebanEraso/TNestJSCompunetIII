import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ValidRoles } from '../enums/roles.enum';
import { RoleProtected } from './role-protected.decorator';
import { RolesGuard } from '../guards/roles.guard';

export function Auth(...roles: ValidRoles[]) {
  return applyDecorators(
    RoleProtected(...roles),
    UseGuards(AuthGuard('jwt'), RolesGuard),
  );
}
