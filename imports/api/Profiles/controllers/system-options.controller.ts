import { Auth, BaseController, Controller, Dto, Method } from 'meteorjs-decorators';
import { SystemOptionType } from '../constants/system-options.constants';
import { SystemOptionsResponseDto } from '../dtos/system-options-response.dto';
import { SystemOptionsService } from '../services/system-options.service';

@Controller()
export class SystemOptionsController extends BaseController {

    constructor(private readonly systemOptionsService: SystemOptionsService) {
        super();
    }

    @Method('profile.getSystemOptions')
    @Auth()
    @Dto(SystemOptionsResponseDto)
    async getSystemOptions(): Promise<SystemOptionType[]> {

        return this.systemOptionsService.getSystemOptionsByUserId(this.__context.userId);
    }
}
