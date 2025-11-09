import { ValidRoles } from '../enums/roles.enum';
export declare function Auth(...roles: ValidRoles[]): <TFunction extends Function, Y>(target: TFunction | object, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<Y>) => void;
