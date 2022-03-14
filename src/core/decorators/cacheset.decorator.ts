import { SetMetadata } from '@nestjs/common';

export const CACHE_KEY = 'CACHE';
export const Cache = ({ key, ttl, paramCache }: { key: string; ttl: number; paramCache: boolean }) =>
    SetMetadata(CACHE_KEY, { key, ttl, paramCache });
