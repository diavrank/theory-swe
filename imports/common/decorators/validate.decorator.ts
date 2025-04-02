import { Meteor } from 'meteor/meteor';
import { RequestDto } from "../dtos/request.dto";
import { Type } from "../types/type.interface";
import { validateSync, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';

export function Validate(...dtos: Type<RequestDto>[] | String[]) {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args: any[]) {
            const STRING_TYPE = 'string';
            const BOOLEAN_TYPE = 'boolean';
            const NUMBER_TYPE = 'number';
            const OBJECT_TYPE = 'object';
            const ARRAY_TYPE = 'array';


            for (let i = 0; i < args.length; i++) {
                if (dtos.length < i + 1) {
                    continue;// do not validate rest of parameters
                }
                let validation: boolean = true;


                switch (typeof dtos[i] === 'string' ? dtos[i] : 'object') {
                    case STRING_TYPE:
                        validation = typeof args[i] === STRING_TYPE;
                        break;
                    case BOOLEAN_TYPE:
                        validation = typeof args[i] === BOOLEAN_TYPE;
                        break;
                    case NUMBER_TYPE:
                        validation = typeof args[i] === NUMBER_TYPE;
                        break;
                    case OBJECT_TYPE:
                    case ARRAY_TYPE:
                        const requestDto = plainToInstance(dtos[i] as Type<RequestDto>, args[i]); // Transform argument into DTO class
                        const errors: ValidationError[] = validateSync(requestDto);

                        if (errors.length > 0) {
                            throw new Meteor.Error('validation-error', 'Validation failed', errors);
                        }

                        // Replace object argument with validated DTO
                        args[i] = requestDto;
                        break;
                    default:
                        throw new Meteor.Error('validation-error', 'Validation failed', `Parameter ${i + 1} has not a valid type.`);
                }
                if (validation === false) {
                    throw new Meteor.Error('validation-error', 'Validation failed', `Parameter ${i + 1} is not ${STRING_TYPE} type`);
                }

            }

            return originalMethod.apply(this, args);
        };
        return descriptor;
    };
}
