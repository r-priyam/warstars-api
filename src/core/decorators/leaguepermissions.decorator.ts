import { SetMetadata } from '@nestjs/common';
import type { Permission } from '~/utils/AdminPermissions';

export const PERMISSIONS_KEY = 'PERMISSIONS';
export const Permissions = (...permissions: Permission[]) => SetMetadata(PERMISSIONS_KEY, permissions);
