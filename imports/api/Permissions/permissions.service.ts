import { ProfileRepository } from '../Profiles/profile.repository';
import { RoleType } from './Permission';
import { RoleRepository } from './role.repository';
import { Injectable } from 'meteorjs-decorators';

@Injectable()
export class PermissionsService {
    private roleRepository = new RoleRepository();
    private profileRepository = new ProfileRepository();

    async listAll(): Promise<RoleType[]> {
        return this.roleRepository.find();
    }

    async getPermissions(profileId: string): Promise<RoleType[]> {
        const profile = await this.profileRepository.findOneOrFail(profileId);
        return this.roleRepository.findByIds(profile.permissions);
    }

    async getPermissionsComplement(profileId: string): Promise<RoleType[]> {
        const profile = await this.profileRepository.findOneOrFail(profileId);
        return this.roleRepository.findComplement(profile.permissions);
    }
}
