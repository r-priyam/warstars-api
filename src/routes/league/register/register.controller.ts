import { Body, Controller, HttpCode, Post } from '@nestjs/common';

import { Authenticated } from '~/core/decorators/auth.decorator';
import { Permissions } from '~/core/decorators/leaguepermissions.decorator';
import { Permission } from '~/utils/AdminPermissions';
import { ROUTES_PREFIX } from '~/utils/Constants';
import { IRegisterChildLeague, IRegisterDivision, IRegisterLeague } from '~/utils/interfaces';

import { RegisterService } from './register.service';

@Controller(ROUTES_PREFIX.LEAGUE.REGISTER)
export class RegisterController {
    constructor(private readonly registerService: RegisterService) {}

    @Post('league')
    @Authenticated()
    @HttpCode(200)
    async registerLeague(@Body() payload: IRegisterLeague) {
        return await this.registerService.registerLeague(payload);
    }

    @Post('child-league')
    @Authenticated()
    @Permissions(Permission.MANAGE_CHILD_LEAGUES)
    @HttpCode(200)
    async registerChildLeague(@Body() payload: IRegisterChildLeague) {
        return await this.registerService.registerChildLeague(payload);
    }

    @Post('child-division')
    @Authenticated()
    @Permissions(Permission.MANAGE_CHILD_DIVISIONS)
    @HttpCode(200)
    async registerChildDivision(@Body() payload: IRegisterDivision) {
        return await this.registerService.registerDivision(payload);
    }
}
