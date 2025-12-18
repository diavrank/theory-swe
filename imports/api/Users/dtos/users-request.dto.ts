import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PaginationRequestDto } from '/imports/common/dtos/pagination-request.dto';

export class UsersRequestDto extends PaginationRequestDto {
	@IsString()
	@IsNotEmpty()
	@IsOptional()
	search?: string;
}
