import { ValidRoles } from '../enums/roles.enum';
export declare const META_ROLES = "roles";
export declare const RoleProtected: (...args: ValidRoles[]) => import("@nestjs/common").CustomDecorator<string>;
