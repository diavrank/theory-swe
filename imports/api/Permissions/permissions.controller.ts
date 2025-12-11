import Permissions from '../../startup/server/Permissions';
import { PermissionsResponseDto } from './dtos/permissions-response.dto';
import { ProfilePermissionsRequestDto } from './dtos/profile-permissions-request.dto';
import { PermissionsService } from './permissions.service';
import { BaseController } from '/imports/common/controllers/base.controller';
import { Controller } from '/imports/common/decorators/controller.decorator';
import { Dto } from '/imports/common/decorators/dto.decorator';
import { Method } from '/imports/common/decorators/method.decorator';
import { CheckPermissions } from '/imports/common/decorators/permissions.decorator';
import { Validate } from '/imports/common/decorators/validate.decorator';

@Controller()
export class PermissionsController extends BaseController {

	constructor(private readonly permissionsService: PermissionsService) {
		super();
	}

	@Method('permissions.list')
	@CheckPermissions(Permissions.PERMISSIONS.LIST.VALUE)
	@Dto(PermissionsResponseDto)
	async listPermissions() {

		return this.permissionsService.listAll();
	}

	@Method('permissions.listByIdProfile')
	@CheckPermissions(Permissions.PERMISSIONS.LIST.VALUE)
	@Validate(ProfilePermissionsRequestDto)
	@Dto(PermissionsResponseDto)
	async listProfilePermissions(requestDto: ProfilePermissionsRequestDto) {
		return this.permissionsService.getPermissions(requestDto.profileId);
	}

	@Method('permissions.listOthersForIdProfile')
	@CheckPermissions(Permissions.PERMISSIONS.LIST.VALUE)
	@Validate(ProfilePermissionsRequestDto)
	@Dto(PermissionsResponseDto)
	async listNotProfilePermissions(requestDto: ProfilePermissionsRequestDto) {
		return this.permissionsService.getPermissionsComplement(requestDto.profileId);
	}
}
