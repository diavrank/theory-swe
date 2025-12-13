import {ResponseDto} from "../dtos/response.dto";
import {Type} from "../types/type.interface";

export function Dto(dto: Type<ResponseDto>) {
    return function (
        _target: any,
        _propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args: any[]) {
            const result = await originalMethod.apply(this, args); // Call the original method
            const responseDto = new dto();

            return responseDto.build(result);
        };
        return descriptor;
    };
}
