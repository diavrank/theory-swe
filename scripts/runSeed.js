#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

const [, , seederName, ...extraArgs] = process.argv;

if (!seederName) {
    console.error('Usage: npm run seed -- <SeederName> [meteor args]');
    process.exit(1);
}

const seedPort = process.env.SEED_PORT || process.env.PORT || '9200';
const hasSettingsArg = extraArgs.some((arg) => arg === '--settings');
const settingsArgs = hasSettingsArg ? [] : ['--settings', path.join('settings', 'settings-development.json')];
const hasPortArg = extraArgs.some((arg) => arg === '--port' || arg.startsWith('--port=') || arg === '-p');
const portArgs = hasPortArg ? [] : ['--port', seedPort];
const meteorArgs = [...settingsArgs, ...portArgs, ...extraArgs];

const childEnv = {
    ...process.env,
    SEED: seederName,
    MONGO_URL: process.env.MONGO_URL || 'mongodb://localhost:27017/theory-swe',
    PORT: seedPort,
};

console.info(`Starting Meteor with SEED=${seederName} on PORT=${seedPort}`);
const meteorProcess = spawn('meteor', meteorArgs, {
    env: childEnv,
    stdio: 'inherit',
    shell: true,
});

meteorProcess.on('exit', (code, signal) => {
    if (signal) {
        console.error(`Seed process exited due to signal ${signal}`);
        process.exit(1);
    }

    process.exit(code ?? 0);
});

meteorProcess.on('error', (error) => {
    console.error('Unable to start Meteor for seed:', error);
    process.exit(1);
});
