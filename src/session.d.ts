import { User } from '~/database';

declare module 'fastify' {
    interface Session {
        user?: User;
    }
}
