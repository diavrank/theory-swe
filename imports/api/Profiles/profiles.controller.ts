import { ResponseMessage } from '@server/utils/ResponseMessage';
import Permissions from '../../startup/server/Permissions';
import { SaveProfileDto } from './dtos/create-profile.dto';
import { DeleteProfileDto } from './dtos/delete-profile.dto';
import { ProfilesService } from './profiles.service';
import { BaseController } from '/imports/common/controllers/base.controller';
import { Controller } from '/imports/common/decorators/controller.decorator';
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
  async saveProfile(saveProfileDto: SaveProfileDto) {

    return this.profilesService.save(saveProfileDto);
  }

  @Method('profile.delete')
  @CheckPermissions(Permissions.PROFILES.DELETE.VALUE)
  @Validate(DeleteProfileDto)
  async deleteProfile(deleteProfileDto: DeleteProfileDto) {
    await this.profilesService.delete(deleteProfileDto.profileId);
    return new ResponseMessage().create('Profile removed successfully!');
  }
} 