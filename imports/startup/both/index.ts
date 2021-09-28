// Import modules used by both client and server through a single index entry point
// e.g. useraccounts configuration file.

import { Accounts } from "meteor/accounts-base";

Accounts.config({
    loginExpirationInDays: 30
});
