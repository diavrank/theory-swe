#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

const [, , backfillName, ...extraArgs] = process.argv;

if (!backfillName) {
    console.error('Usage: npm run backfill -- <BackfillName> [meteor args]');
    process.exit(1);
}

const backfillPort = process.env.BACKFILL_PORT || process.env.PORT || '9100';
const hasSettingsArg = extraArgs.some((arg) => arg === '--settings');
const settingsArgs = hasSettingsArg ? [] : ['--settings', path.join('settings', 'settings-development.json')];
const hasPortArg = extraArgs.some((arg) => arg === '--port' || arg.startsWith('--port=') || arg === '-p');
const portArgs = hasPortArg ? [] : ['--port', backfillPort];
const meteorArgs = [...settingsArgs, ...portArgs, ...extraArgs];


const childEnv = {
    ...process.env,
    BACKFILL: backfillName,
    MONGO_URL: process.env.MONGO_URL || 'mongodb://localhost:27017/theory-swe',
    PORT: backfillPort,
};

console.info(`Starting Meteor with BACKFILL=${backfillName} on PORT=${backfillPort}`);
const meteorProcess = spawn('meteor', meteorArgs, {
    env: childEnv,
    stdio: 'inherit',
    shell: true,
});

meteorProcess.on('exit', (code, signal) => {
    if (signal) {
        console.error(`Backfill process exited due to signal ${signal}`);
        process.exit(1);
    }

    process.exit(code ?? 0);
});

meteorProcess.on('error', (error) => {
    console.error('Unable to start Meteor for backfill:', error);
    process.exit(1);
});
