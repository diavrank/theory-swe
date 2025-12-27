import { PermissionsController } from './permissions.controller';
import { PermissionsPublication } from './permissions.publication';
import { PermissionsService } from './permissions.service';
import { Module } from 'meteorjs-decorators';

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
