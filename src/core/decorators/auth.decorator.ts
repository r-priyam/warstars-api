import { SetMetadata } from '@nestjs/common';

export const AUTH_KEY = 'AUTHENTICATED';
export const Authenticated = () => SetMetadata(AUTH_KEY, true);
