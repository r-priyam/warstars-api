import { SetMetadata } from '@nestjs/common';
import { Permission } from '~/utils/AdminPermissions';

export const PERMISSIONS_KEY = 'PERMISSIONS';
export const Permissions = (...permissions: Permission[]) => SetMetadata(PERMISSIONS_KEY, permissions);
