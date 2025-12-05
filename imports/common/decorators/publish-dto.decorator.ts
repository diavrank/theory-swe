import 'reflect-metadata';
import { ResponseDto } from '../dtos/response.dto';
import { Type } from '../types/type.interface';

const PUBLISH_DTO_METADATA_KEY = Symbol('publish_dto');

export function PublishDto(dto: Type<ResponseDto>) {
	return function(target: any) {
		Reflect.defineMetadata(PUBLISH_DTO_METADATA_KEY, dto, target);
	};
}

export function getPublishDto(target: any): Type<ResponseDto> | undefined {
	return Reflect.getMetadata(PUBLISH_DTO_METADATA_KEY, target);
}
