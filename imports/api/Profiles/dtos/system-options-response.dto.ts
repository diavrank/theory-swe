import { SystemOptionType } from '../constants/system-options.constants';
import { SystemOptionResponseDto } from './system-option-response.dto';
import { ResponseDto } from 'meteorjs-decorators';

export class SystemOptionsResponseDto extends ResponseDto {
    data: SystemOptionResponseDto[];

    build(systemOptions: SystemOptionType[]): SystemOptionsResponseDto {
        this.data = systemOptions.map(option => new SystemOptionResponseDto().build(option));

        return this.send();
    }
}
