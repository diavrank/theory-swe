import { AuthService } from './auth.service';
import { CheckPermissionRequestDto } from './dtos/check-permission-request.dto';
import { CheckPermissionResponseDto } from './dtos/check-permission-response.dto';
import { BaseController } from '/imports/common/controllers/base.controller';
import { Controller } from '/imports/common/decorators/controller.decorator';
import { Dto } from '/imports/common/decorators/dto.decorator';
import { Method } from '/imports/common/decorators/method.decorator';
import { Validate } from '/imports/common/decorators/validate.decorator';

@Controller()
export class AuthController extends BaseController {
    constructor(private readonly authService: AuthService) {
        super();
    }

    @Method('auth.checkPermission')
    @Validate(CheckPermissionRequestDto)
    @Dto(CheckPermissionResponseDto)
    async checkPermission(request: CheckPermissionRequestDto): Promise<boolean> {
        return this.authService.checkPermission(request);
    }
}
