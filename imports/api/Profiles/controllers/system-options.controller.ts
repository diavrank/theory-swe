import { SystemOptionType } from '../system-options.constants';
import { SystemOptionsService } from '../system-options.service';
import { SystemOptionsResponseDto } from '../dtos/system-options-response.dto';
import { BaseController } from '/imports/common/controllers/base.controller';
import { Auth } from '/imports/common/decorators/auth-guard.decorator';
import { Controller } from '/imports/common/decorators/controller.decorator';
import { Dto } from '/imports/common/decorators/dto.decorator';
import { Method } from '/imports/common/decorators/method.decorator';

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
