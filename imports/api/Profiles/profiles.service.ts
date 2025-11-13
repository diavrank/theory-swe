import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';
import { UserService } from '../Users/users.service';
import { SaveProfileDto } from './dtos/create-profile.dto';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { Profile } from './profile.entity';
import { ProfileRepository } from './profile.repository';
import { StaticProfiles } from './ProfileSeeder';
import { Inject } from '/imports/common/decorators/inject.decorator';
import { Injectable } from '/imports/common/decorators/injectable.decorator';
import { ResponseMessage } from '/imports/startup/server/utils/ResponseMessage';
import { forwardRef } from '/imports/common/utils/forward-ref';

@Injectable()
export class ProfilesService {
  private profileRepository = new ProfileRepository();
  
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService
  ) {}

  async validateName(name: string, profileId?: string): Promise<void> {
    const existingProfile = await this.profileRepository.findOneByName(name);
    if (profileId) {
      const oldProfile = await this.profileRepository.findOneOrFail(profileId);
      if (oldProfile?.name !== name && existingProfile) {
        throw new Meteor.Error('403', 'The profile name already exists');
      }
    } else if (existingProfile) {
      throw new Meteor.Error('403', 'The profile name already exists');
    }
  }

  async create(createProfileDto: SaveProfileDto): Promise<string> {
    const { name, description, permissions } = createProfileDto;
    return this.profileRepository.insert({
      name,
      description,
      permissions
    });
  }

  async update(updateProfileDto: UpdateProfileDto): Promise<void> {
    if (updateProfileDto.name) {
      await this.validateName(updateProfileDto.name, updateProfileDto._id);
    }
    await this.profileRepository.update(updateProfileDto._id, updateProfileDto);
  }

  async save(saveProfileDto: SaveProfileDto): Promise<ResponseMessage> {
    const { _id, name, description, permissions } = saveProfileDto;
    await this.validateName(name,_id);

    const responseMessage = new ResponseMessage();
    if (_id) {
      await this.profileRepository.update(_id, {
        $set: {
          name,
          description,
          permissions
        }
      });
      responseMessage.create('Profile updated successfully!');
    } else {
      await this.profileRepository.insert({
        name,
        description,
        permissions
      });
      responseMessage.create('Profile created successfully!');
    }
    return responseMessage;
  }

  async delete(id: string): Promise<void> {
    const users = await this.getUsersByProfile(id);
    if (users.length > 0) {
      throw new Meteor.Error('403', 'Cannot delete profile: There are users using this profile');
    }
    await this.profileRepository.softDelete(id);
  }

  async getUsersByProfile(profileId: string): Promise<any[]> {
    const profile = await this.profileRepository.findOneOrFail(profileId);
    return this.userService.getUsersByProfileName(profile?.name);
  }

  async getOneByProfileName(profileName: string): Promise<Profile | undefined> {
    return this.profileRepository.findOneByName(profileName);
  }

  async setUserRoles(userId: string, profileName: string): Promise<void> {
    const profile = await this.profileRepository.findOneByName(profileName);
    // @ts-ignore
    await Meteor.roleAssignment.removeAsync({ 'user._id': userId });
    await Roles.setUserRolesAsync(userId, profile?.permissions, profileName);
  }

  async profileExists(profileName: string): Promise<boolean> {
    return !!await this.profileRepository.findOneByName(profileName);
  }

  getStaticProfileNames(): string[] {
    return Object.keys(StaticProfiles).map((staticProfileName: string) => {
      return StaticProfiles[staticProfileName].name;
    });
  }

  getStaticProfilesForExternalUsers(): string[] {
    return Object.keys(StaticProfiles)
      .filter(staticProfileName => StaticProfiles[staticProfileName].external)
      .map(staticProfileName => StaticProfiles[staticProfileName].name);
  }

  async afterUpdate(oldDoc: Profile, newDoc: Profile): Promise<void> {
    if (oldDoc.name !== newDoc.name) {
      await Meteor.users.updateAsync(
        { 'profile.profile': oldDoc.name },
        { $set: { 'profile.profile': newDoc.name } },
        { multi: true }
      );
    }
    const users = await this.userService.getUsersByProfileName(newDoc?.name);
    const userIds = users.map(user => user._id);
    // @ts-ignore
    await Meteor.roleAssignment.removeAsync({ 'user._id': { $in: userIds } });
    await Roles.setUserRolesAsync(userIds, newDoc.permissions, newDoc.name);
  }
} 
