import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';
import { RequestDto } from './request.dto';

export class PaginationRequestDto extends RequestDto {
	@Type(() => Number)
	@IsInt()
	@Min(1)
	page: number = 1;

	@Type(() => Number)
	@IsInt()
	@Min(1)
	@Max(100)
	limit: number = 10;
}

