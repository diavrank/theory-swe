import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';
import { User } from '../Users/user.entity';
import { UserService } from '../Users/users.service';
import { StaticProfiles } from './constants/static-profiles.constant';
import { SaveProfileDto } from './dtos/create-profile.dto';
import { type Profile } from './profile.entity';
import { ProfileRepository } from './profile.repository';
import { Inject } from '/imports/common/decorators/inject.decorator';
import { Injectable } from '/imports/common/decorators/injectable.decorator';
import { forwardRef } from '/imports/common/utils/forward-ref';

@Injectable()
export class ProfilesService {
  private profileRepository = new ProfileRepository();

  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService
  ) { }

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

  async update(updateProfileDto: SaveProfileDto): Promise<void> {
    const { name: newProfileName,
      permissions: newPermissions,
      description: newDescription
    } = updateProfileDto;

    const oldProfile = await this.profileRepository.findOneOrFail(updateProfileDto._id);

    await this.validateName(newProfileName, updateProfileDto._id);
    await this.profileRepository.update(updateProfileDto._id, {
      $set: {
        name: newProfileName,
        description: newDescription,
        permissions: newPermissions
      }
    });

    // Update permissions
    if (oldProfile.name !== updateProfileDto.name) {
      // TODO: use usersService
      await User.collection.updateAsync(
        { 'profile.profile': oldProfile.name },
        { $set: { 'profile.profile': newProfileName } },
        { multi: true }
      );
    }
    const users = await this.userService.getUsersByProfileName(newProfileName);
    const userIds = users.map(user => user._id);
    // @ts-ignore
    await Meteor.roleAssignment.removeAsync({ 'user._id': { $in: userIds } });
    await Roles.setUserRolesAsync(userIds, newPermissions, newProfileName);
  }

  async save(saveProfileDto: SaveProfileDto): Promise<Profile> {
    const { _id, name, description, permissions } = saveProfileDto;
    await this.validateName(name, _id);

    let profileId = _id;
    if (profileId) {
      await this.update(saveProfileDto);

    } else {
      profileId = await this.profileRepository.insert({
        name,
        description,
        permissions
      });
    }

    return this.profileRepository.findOneOrFail(profileId);
  }

  async delete(id: string): Promise<void> {
    const users = await this.getUsersByProfile(id);
    if (users.length > 0) {
      throw new Meteor.Error('403', 'Cannot delete profile: There are users using this profile');
    }
    await this.profileRepository.delete(id);
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

  async listNonExternalProfiles(): Promise<Profile[]> {
    return this.profileRepository.find({ name: { $nin: this.getStaticProfilesForExternalUsers() } });
  }

  async listPaginatedProfiles({ page, limit }: { page: number; limit: number }): Promise<{ profiles: Profile[]; total: number }> {
    const selector = { name: { $nin: this.getStaticProfileNames() } };
    const pageNumber = Math.max(1, Number(page) || 1);
    const pageSize = Math.min(Math.max(Number(limit) || 1, 1), 100);
    const profiles = await this.profileRepository.find(selector, {
      sort: { description: 1 },
      limit: pageSize,
      skip: (pageNumber - 1) * pageSize
    });
    const total = await this.profileRepository.findAll(selector, { fields: { _id: 1 } }).countAsync();

    return { profiles, total };
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
} 
