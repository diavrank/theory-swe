import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PaginationRequestDto } from 'meteorjs-decorators';

export class UsersRequestDto extends PaginationRequestDto {
	@IsString()
	@IsNotEmpty()
	@IsOptional()
	search?: string;
}
