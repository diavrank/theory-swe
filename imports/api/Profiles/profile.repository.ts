import { ProfileCollection } from './ProfileCollection';
import { Profile } from './profile.entity';
import { BaseRepository } from '/imports/common/repositories/base.repository';

export class ProfileRepository extends BaseRepository<Profile>{
  constructor() {
    super(ProfileCollection);
  }

  async findOneByName(name: string): Promise<Profile | undefined> {
    return this.findOne({ name });
  }
} 