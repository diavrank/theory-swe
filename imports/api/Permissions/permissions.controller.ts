import { BaseController, CheckPermissions, Controller, Dto, Method, Validate } from 'meteorjs-decorators';
import { PermissionsResponseDto } from './dtos/permissions-response.dto';
import { ProfilePermissionsRequestDto } from './dtos/profile-permissions-request.dto';
import Permissions from './helpers/permissions.helpers';
import { PermissionsService } from './permissions.service';

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
