import { Module, forwardRef } from 'meteorjs-decorators';
import { ProfilesModule } from '../Profiles/profiles.module';
import { UsersController } from './users.controller';
import { UsersPublication } from './users.publication';
import { UserService } from './users.service';

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
export class UsersModule { } 
