import Permissions from '../Permissions/helpers/permissions.helpers';
import { SaveProfileDto } from './dtos/create-profile.dto';
import { DeleteProfileDto } from './dtos/delete-profile.dto';
import { ProfileResponseDto } from './dtos/profile-response.dto';
import { ProfilesPaginatedRequestDto } from './dtos/profiles-paginated-request.dto';
import { ProfilesPaginatedResponseDto } from './dtos/profiles-paginated-response.dto';
import { ProfilesResponseDto } from './dtos/profiles-response.dto';
import { ProfilesService } from './profiles.service';
import { BaseController } from '/imports/common/controllers/base.controller';
import { Controller } from '/imports/common/decorators/controller.decorator';
import { Dto } from '/imports/common/decorators/dto.decorator';
import { Method } from '/imports/common/decorators/method.decorator';
import { CheckPermissions } from '/imports/common/decorators/permissions.decorator';
import { Validate } from '/imports/common/decorators/validate.decorator';

@Controller()
export class ProfilesController extends BaseController {

  constructor(private readonly profilesService: ProfilesService) {
    super();
  }

  @Method('profile.save')
  @CheckPermissions(Permissions.PROFILES.CREATE.VALUE, Permissions.PROFILES.UPDATE.VALUE)
  @Validate(SaveProfileDto)
  @Dto(ProfileResponseDto)
  async saveProfile(saveProfileDto: SaveProfileDto) {

    return this.profilesService.save(saveProfileDto);
  }

  @Method('profile.delete')
  @CheckPermissions(Permissions.PROFILES.DELETE.VALUE)
  @Validate(DeleteProfileDto)
  async deleteProfile(deleteProfileDto: DeleteProfileDto) {
    return this.profilesService.delete(deleteProfileDto.profileId);
  }

  @Method('profile.listNonExternal')
  @CheckPermissions(Permissions.PROFILES.LIST.VALUE)
  @Dto(ProfilesResponseDto)
  async listNonExternalProfiles() {
    return this.profilesService.listNonExternalProfiles();
  }

  @Method('profile.listPaginated')
  @CheckPermissions(Permissions.PROFILES.LIST.VALUE)
  @Validate(ProfilesPaginatedRequestDto)
  @Dto(ProfilesPaginatedResponseDto)
  async listPaginatedProfiles(requestDto: ProfilesPaginatedRequestDto) {
    return this.profilesService.listPaginatedProfiles(requestDto);
  }
}
