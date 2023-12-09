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

**Tech stack:** Meteor (Node.js), MongoDB, Vue 3, Vuetify, TypeScript, Mocha.

Supported Platforms
-------------------

- macOS 12+
- Linux
- Windows 10+

System Requirements
-------------------

- Node 14+ [download here](https://nodejs.org/es/download/)
- Yarn 1.22.0+
- Meteor 2.13.3 [Installation](https://www.meteor.com/install)
- Mongo [6.0.4](https://www.mongodb.com/download-center/community) and [Mongo Booster](https://nosqlbooster.com/downloads) 
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

**Configure environment variables file**

Go to `./settings/` and copy `settings-development-example.json` to `settings-development.json` and modify the following:

- **MAIL_URL:** Update the connection string according to your smtp credentials.

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


**Note:**
You can configure your Jetbrains IDE to run the project from the IDE execution button.


Usage
---------------

User to login:

 - **Username/Email:** admin or admin@example.com
 - **Password:** Theory_5w3
