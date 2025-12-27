import { Auth, BaseController, Controller, Dto, Method, Validate } from 'meteorjs-decorators';
import { AuthService } from './auth.service';
import { CheckPermissionRequestDto } from './dtos/check-permission-request.dto';
import { CheckPermissionResponseDto } from './dtos/check-permission-response.dto';

@Controller()
export class AuthController extends BaseController {
    constructor(private readonly authService: AuthService) {
        super();
    }

    @Method('auth.checkPermission')
    @Auth()
    @Validate(CheckPermissionRequestDto)
    @Dto(CheckPermissionResponseDto)
    async checkPermission(request: CheckPermissionRequestDto): Promise<boolean> {
        const userId = this.__context.userId;

        return this.authService.checkPermission(userId, request);
    }
}
