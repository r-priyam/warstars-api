import { Body, Controller, HttpCode, Post } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { RegisterService } from './register.service';
import { Authenticated } from '~/core/decorators/auth.decorator';
import { Permission } from '~/utils/AdminPermissions';
import { Permissions } from '~/core/decorators/leaguepermissions.decorator';
import type { IRegisterChildLeague, IRegisterDivision, IRegisterLeague } from '~/utils/interfaces';

@Controller('register')
export class RegisterController {
    constructor(private readonly regusterService: RegisterService) {}

    @Post('league')
    @Authenticated()
    @HttpCode(200)
    async registerLeague(@Body() payload: IRegisterLeague) {
        return await this.regusterService.registerLeague(payload);
    }

    @Post('child-league')
    @Authenticated()
    @Permissions(Permission.MANAGE_CHILD_LEAGUES)
    @HttpCode(200)
    async registerChildLeague(@Body() payload: IRegisterChildLeague) {
        return await this.regusterService.registerChildLeague(payload);
    }

    @Post('child-division')
    @Authenticated()
    @Permissions(Permission.MANAGE_CHILD_DIVISIONS)
    @HttpCode(200)
    async registerChildDivision(@Body() payload: IRegisterDivision) {
        return await this.regusterService.registerDivision(payload);
    }
}
