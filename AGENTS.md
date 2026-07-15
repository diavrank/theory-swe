# AGENTS

## App Overview

- `theory-swe` is a Meteor 3 application with a Vue 3 + Vuetify frontend and MongoDB backing store.
- The app covers authentication, users, permissions/profiles, email flows, and digital signature features.
- Server code is TypeScript and the project uses Meteor's full-app runtime rather than a split SPA/API deployment.

## Stack

- Runtime: Node.js 22+, Meteor 3.3.x
- Package manager: Yarn 1.x
- Frontend: Vue 3, Vuetify, Pinia, Vue Router
- Backend: Meteor, routing-controllers, MongoDB
- Tests: Mocha via `meteor test`
- Build tooling: TypeScript, Rspack, Sass

## Common Commands

- Install dependencies: `yarn`
- Start locally: `yarn start`
- Start with debugger: `yarn start:debug`
- Run tests: `yarn test`
- Run tests in watch mode: `yarn test:watch`
- Run a backfill: `yarn backfill <BackfillName>`
- Run seed data: `yarn seed`

## Local Environment

- Default local MongoDB: `mongodb://localhost:27017/theory-swe`
- Meteor settings file: `settings/settings-development.json`
- Example settings template: `settings/settings-development-example.json`
- Mail development commonly uses Mailpit; `MAIL_URL` and the `private.MAILPIT` block live in the settings file.

## Repo Layout

- `client/`: Meteor client entrypoint
- `server/`: Meteor server entrypoint
- `imports/api/`: domain/server modules such as `Authentication`, `Users`, `Permissions`, `Profiles`, and `DigitalSignature`
- `imports/ui/`: Vue UI, routes, stores, layouts, and shared frontend components
- `imports/startup/`: Meteor startup wiring for client/server/both
- `imports/backfills/`: one-off and recurring backfill jobs
- `imports/seeders/`: seed data scripts
- `tests/server/`: server-side test suites organized by domain
- `scripts/`: helper scripts used by package commands
- `settings/`: local development settings templates

## Working Notes For Agents

- Prefer narrow, domain-scoped changes. Most business logic is organized under `imports/api/<Domain>`.
- Keep frontend work aligned with the existing Vue/Vuetify patterns under `imports/ui/`.
- When adding tests, place them in the matching domain directory under `tests/server/`.
- This repo may contain unrelated work in progress. Check `git status` before staging and avoid bundling unrelated files into a commit or PR.
- For environment-sensitive changes, verify whether the behavior is configured through Meteor settings before hardcoding values.
