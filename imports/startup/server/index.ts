// Import server startup through a single index entry point

import './Permissions';
import './SecurityConfig';
import './services/FirebaseAdmin';
import './services/MailServ';
import './utils/helpers';

import '../../api/Rest/UsersRest';
import '../../api/Users/users.controller';
import '../../api/Users/users.publication';

import '../../api/Permissions/PermissionsCtrl';
import '../../api/Permissions/PermissionsPubs';

import '../../api/Profiles/Profile';
import '../../api/Profiles/ProfileSeeder';
import '../../api/Profiles/ProfilesCtrl';
import '../../api/Profiles/ProfilesPubs';

import '../../api/SystemOptions/SystemOption';
import '../../api/SystemOptions/SystemOptionsCtrl';

import '../../api/DigitalSignature/DigitalSignatureCtrl';

import '../../api/Binnacle/BinnacleCtrl';
