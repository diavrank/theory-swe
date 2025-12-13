import { PermissionsController } from './permissions.controller';
import { PermissionsPublication } from './permissions.publication';
import { PermissionsService } from './permissions.service';
import { Module } from '/imports/common/utils/module';

@Module({
    controllers: [
        PermissionsController,
        PermissionsPublication
    ],
    providers: [
        PermissionsService
    ]
})
export class PermissionsModule {}
