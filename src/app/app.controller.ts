import * as os from 'os';
import { Controller, Get, Res } from '@nestjs/common';
import type { FastifyReply } from 'fastify';

@Controller()
export class AppController {
    @Get()
    getHello(@Res() response: FastifyReply) {
        return response.status(302).redirect('https://warstars.priyam.tech');
    }

    @Get('status')
    status() {
        return {
            MEMORY_USAGE: `${(process.memoryUsage().heapUsed / (1024 * 1024)).toFixed(2)} MB`,
            FREE_MEMORY: `${(os.freemem() / (1024 * 1024)).toFixed(2)} MB`
        };
    }
}
