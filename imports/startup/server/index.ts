// Import server startup through a single index entry point
import './SecurityConfig';
import './services/FirebaseAdmin';
import './services/MailServ';

import { AppModule } from '../../api/app.module';
import '../../api/Rest/UsersRest';

import '../../backfills/recurring/RefreshPermissionsBackfill';
import '../../backfills/recurring/RefreshStaticProfilesBackfill';

const appModule = new AppModule();
