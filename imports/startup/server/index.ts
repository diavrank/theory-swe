// Import server startup through a single index entry point

import './Permissions';
import './SecurityConfig';
import './services/FirebaseAdmin';
import './services/MailServ';
import './utils/helpers';

import { AppModule } from '../../api/app.module';
import '../../api/Rest/UsersRest';

import '../../api/Profiles/profiles.publication';
import '../../api/Profiles/ProfileSeeder';

const appModule = new AppModule();
