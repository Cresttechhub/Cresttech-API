import { SetMetadata } from '@nestjs/common';
import { UserType } from '../types/type.enum';

export const Roles = (...roles: UserType[]) => SetMetadata('roles', roles);
