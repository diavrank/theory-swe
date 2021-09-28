# Theoretical concepts about software engineering

## Description

Web app which includes:
- Authentication
- Users management

Applies concepts like:

- [X] Code reviews
- [ ] Access modifiers
- [X] Architecture patterns (N Layers, Server-Client)
- [X] Design patterns
  - Creationals
    - Factory
    - Singleton
  - Structural
  - Behavorial
    - Observer (Publish/Subscribe)
- [ ] SOLID principles (theory)
- Object-oriented programming
  - [ ] What is a class?
  - [ ] What is inheritance?
  - [ ] What is an interface?
  - [ ] What is polymorphism?
- Web APIs
  - [ ] What is a Web API?
  - [ ] Which tools can be used to test Web APIs?
  - [ ] Error handling tools
- [ ] TDD

**Tech stack:** Meteor (Node.js), MongoDB, Vue 2, Vuetify, TypeScript, Mocha.

Supported Platforms
-------------------

- macOS 10.12+
- Linux
- Windows 10

System Requirements
-------------------

- Node 14+ [download here](https://nodejs.org/es/download/)
- Yarn 1.22.0+
- Meteor 2.4 [Installation](https://www.meteor.com/install)
- Mongo [4.4.9](https://www.mongodb.com/download-center/community) and [Mongo Booster](https://nosqlbooster.com/downloads) 
- **Note:** In some cases it is necesary to disable antivrus in order to works SMTP Server

## Installation

- Clone the last version of repository [here](https://github.com/diavrank/theory-swe.git)
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

- Import more data of a specific collection to the database:
```shell
mongoimport --db theory-swe --collection <collection_name> <path_collection_json>
```

- Export data of a specific collection from the database:
```shell
mongoexport --db theory-swe --collection <collection_name>
```

- Restore backup of database from external database:
```shell
mongorestore --host <HOST> --port <PORT> --username=<USERNAME> --password=<PASSWORD> --authenticationDatabase admin --db <DATABASE> ./database/theory-swe
```

- Export backup of database from external database:
```shell
mongodump --host <HOST> --port <PORT> --username=<USERNAME> --password=<PASSWORD> --authenticationDatabase admin --db <DATABASE> --out ./path_to_save
```

- Restore backup of database from Mongo Atlas:
```shell
mongorestore --uri mongodb+srv://<USER>:<PASSWORD>@<HOST> --db theory-swe ./database/theory-swe
```

- Export backup of database from Mongo Atlas:
```shell
mongodump --uri mongodb+srv://<USER>:<PASSWORD>@<HOST>/<DATABASE> --out ./path_to_save
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

