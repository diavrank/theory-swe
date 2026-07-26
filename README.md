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

- Node 24+ [download here](https://nodejs.org/es/download/)
- npm 11+
- Meteor 3.5 [Installation](https://www.meteor.com/install)
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
npm run backfill -- <backfill_name>
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
npm ci
```

**Configure environment variables file (Optional)**

Go to `./settings/` and copy `settings-development-example.json` to `settings-development.json` and modify the following:

- **MAIL_URL:** 

For development environment.

Install mailpit:
````shell
brew install mailpit
````
Start mailpit as a service:
````shell
brew services start mailpit
````

For production environment:
Update the connection string according to your smtp credentials.

Running project
---------------

**On Mac OS X and Linux**
- Run the following commands:
```shell
npm start
```

**On Windows**
- Run the following commands:
```shell
SET MONGO_URL=mongodb://localhost:27017/theory-swe
npm run run:windows
```

Usage
---------------

User to login:

 - **Username/Email:** admin or admin@example.com
 - **Password:** Theory_5w3

Releases and deployments
------------------------

Releases are managed by Release Please on the `dev` branch. Use Conventional
Commit messages (including squash-merge commit titles) to select the next
Semantic Version. The automated release history starts from the `1.0.0`
baseline:

- `fix: correct password validation` creates a patch release (`1.2.3` to
  `1.2.4`).
- `feat: add audit export` creates a minor release (`1.2.3` to `1.3.0`).
- Add `!` after the type, such as `feat!: replace the authentication API`, or
  include a `BREAKING CHANGE:` footer to create a major release (`1.2.3` to
  `2.0.0`).

After releasable commits reach `dev`, Release Please opens or updates one
release pull request containing the version changes and changelog. Merging that
pull request creates the corresponding GitHub release and immutable `vX.Y.Z`
Git tag. The workflow uses the repository-provided `GITHUB_TOKEN`; no release
secret is required. Repository settings must allow GitHub Actions to create
pull requests.

To deploy a release, run the **Deploy** workflow and enter its tag (for example
`v1.2.3`) in `release_tag`. This checks out that exact tag and publishes the
Docker image with the same tag. Alternatively, select a release tag in the
workflow's branch/tag selector and leave `release_tag` empty. To redeploy that
exact image without rebuilding or changing it, use the same release tag and
disable `build_image`.

For development or other manual deployments, leave `release_tag` empty. An
explicit `image_tag` is still supported; if both fields are empty, the workflow
uses `<environment>-<12-character commit SHA>`.
