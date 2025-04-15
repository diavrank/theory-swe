// Import server startup through a single index entry point

import './Permissions';
import './SecurityConfig';
import './services/FirebaseAdmin';
import './services/MailServ';
import './utils/helpers';

import { AppModule } from '../../api/app.module';
import '../../api/Rest/UsersRest';
import '../../api/Users/users.publication';

import '../../api/Permissions/PermissionsCtrl';
import '../../api/Permissions/PermissionsPubs';

import '../../api/Profiles/profiles.publication';
import '../../api/Profiles/ProfileSeeder';

import '../../api/SystemOptions/SystemOption';
import '../../api/SystemOptions/SystemOptionsCtrl';

import '../../api/DigitalSignature/DigitalSignatureCtrl';

import '../../api/Binnacle/BinnacleCtrl';

const appModule = new AppModule();