// Import server startup through a single index entry point
import './SecurityConfig';
import './services/FirebaseAdmin';
import './services/MailServ';

import { AppModule } from '../../api/app.module';
import '../../api/Users/users-rest.controller';
import { initBackfills } from '../../backfills/runBackfills';

const appModule = new AppModule();

initBackfills();
