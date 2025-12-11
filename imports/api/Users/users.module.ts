import { ProfilesModule } from '../Profiles/profiles.module';
import { UsersController } from './users.controller';
import { UsersPublication } from './users.publication';
import { UserService } from './users.service';
import { forwardRef } from '/imports/common/utils/forward-ref';
import { Module } from '/imports/common/utils/module';

@Module({
    imports: [
        forwardRef(() => ProfilesModule)
    ],
    controllers: [
        UsersController,
        UsersPublication
    ],
    providers: [
        UserService
    ]
})
export class UsersModule {} 
