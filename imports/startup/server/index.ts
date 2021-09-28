// Import server startup through a single index entry point

import './SecurityConfig';
import './services/MailServ';
import './services/FirebaseAdmin';
import './utils/helpers';
import './Permissions';
import '../../api/Users/UserSeeder';
import '../../api/Users/UsersCtrl';
import '../../api/Users/UsersPubs';
import '../../api/Rest/UsersRest';

import '../../api/Permissions/PermissionsCtrl';
import '../../api/Permissions/PermissionsPubs';

import '../../api/Profiles/Profile';
import '../../api/Profiles/ProfileSeeder';
import '../../api/Profiles/ProfilesCtrl';
import '../../api/Profiles/ProfilesPubs';

import '../../api/SystemOptions/SystemOption';
import '../../api/SystemOptions/SystemOptionsCtrl';

import '../../api/Binnacle/BinnacleCtrl';
