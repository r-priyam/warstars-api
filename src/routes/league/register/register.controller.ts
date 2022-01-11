import { Body, Controller, Post } from '@nestjs/common';
import { Authenticated } from '~/core/decorators/auth.decorator';
import { Permission } from '~/utils/AdminPermissions';
import { Permissions } from '~/core/decorators/leaguepermissions.decorator';
import { RegisterService } from './register.service';
import { IRegisterChildLeague, IRegisterDivision, IRegisterLeague } from '~/utils/interfaces';

@Controller('register')
export class RegisterController {
	constructor(private readonly regusterService: RegisterService) {}

	@Post('')
	@Authenticated()
	async registerLeague(@Body() payload: IRegisterLeague) {
		return await this.regusterService.registerLeague(payload);
	}

	@Post('child-league')
	@Authenticated()
	@Permissions(Permission.MANAGE_CHILD_LEAGUES)
	async registerChildLeague(@Body() payload: IRegisterChildLeague) {
		return await this.regusterService.registerChildLeague(payload);
	}

	@Post('division')
	@Authenticated()
	@Permissions(Permission.MANAGE_CHILD_DIVISIONS)
	async registerChildDivision(@Body() payload: IRegisterDivision) {
		return await this.regusterService.registerDivision(payload);
	}
}
