import { SystemOptionType } from '../constants/system-options.constants';
import { ResponseDto } from '/imports/common/dtos/response.dto';

export class SystemOptionResponseDto extends ResponseDto {
    icon: string;
    title: string;
    description: string | null;
    permission: string;
    namePath: string;
    divider: boolean;

    build(systemOption: SystemOptionType): SystemOptionResponseDto {
        this.icon = systemOption.icon;
        this.title = systemOption.title;
        this.description = systemOption.description;
        this.permission = systemOption.permission;
        this.namePath = systemOption.namePath;
        this.divider = !!systemOption.divider;

        return this.send();
    }
}
