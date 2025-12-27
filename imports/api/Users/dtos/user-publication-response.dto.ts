import { ResponseDto } from 'meteorjs-decorators';
import type { User, UserProfileType, UserStatusType } from '../user.entity';

export class UserPublicationResponseDto extends ResponseDto {
	id: string;
	username: string;
	email: string;
	createdAt: Date;
	profile: UserProfileType;
	status: UserStatusType;

	build(user: User): UserPublicationResponseDto {
		this.id = user._id;
		this.username = user.username;
		this.email = user.emails[0].address;
		this.createdAt = user.createdAt;
		this.profile = user.profile;
		this.status = { online: user.status.online };

		return this.send();
	}
}
