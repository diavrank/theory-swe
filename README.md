# Scaffold

## Description

Real-time web app which includes:
- Authentication
- Users management
- Email sendings
- TLS configuration for production
- HTTP Security Headers (Helmet)
- Endpoint tests
- CI Pipeline for GitHub Actions

Additional apps:

- Digital Signature

Applies concepts like:

- [X] Architecture patterns (N-Layers, Server-Client)
- [X] Design patterns
  - Creational
    - Factory
    - Singleton
  - Structural
    - Facade
  - Behavioral
    - Observer (Publish/Subscribe)
- [X] Role Based Access Control (RBAC)

**Tech stack:** Meteor (Node.js), MongoDB, Vue, Vuetify, TypeScript, Mocha.

Supported Platforms
-------------------

- macOS 12+
- Linux
- Windows 10+

System Requirements
-------------------

- Node 22+ [download here](https://nodejs.org/es/download/)
- Yarn 1.22.0+
- Meteor 3.3.2 [Installation](https://www.meteor.com/install)
- Mongo [7.0.4](https://www.mongodb.com/download-center/community) and [Mongo Booster](https://nosqlbooster.com/downloads) 
- **Note:** In some cases it is necesary to disable antivrus in order to works SMTP Server

## Installation

- Clone the last version of the repository [here](https://github.com/diavrank/theory-swe.git)
- Verify you are on **dev** branch

**Database configuration with terminal**

Note: For Windows Systems verify that mongo is configured as environment system variable.

1. Open a terminal in the project root
2. Restore the database with:
```shell
mongorestore --db theory-swe ./database/theory-swe
```

**Run the backfills:**

```shell
yarn backfill <backfill_name>
```

Available backfills:
 - RefreshPermissionsBackfill
 - RefreshStaticProfilesBackfill

**The following commands are only for support:**

- Export a backup of the database (data exported as formats BSON and JSON):
```shell
mongodump --db theory-swe --out ./database/
```

**Installing dependencies**

- Run the following commands to install the dependencies:
```shell
yarn
```

**Configure environment variables file (Optional)**

Go to `./settings/` and copy `settings-development-example.json` to `settings-development.json` and modify the following:

- **MAIL_URL:** 

For development environment.

Install mailpit:
````shell
brew install mailpit
````
Open a separate terminal to run mailpit:
````shell
mailpit
````

For production environment:
Update the connection string according to your smtp credentials.

Running project
---------------

**On Mac OS X and Linux**
- Run the following commands:
```shell
yarn run:mac
```

**On Windows**
- Run the following commands:
```shell
SET MONGO_URL=mongodb://localhost:27017/theory-swe
yarn run:windows
```

Usage
---------------

User to login:

 - **Username/Email:** admin or admin@example.com
 - **Password:** Theory_5w3
