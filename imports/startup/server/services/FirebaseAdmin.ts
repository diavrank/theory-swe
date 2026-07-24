import firebaseAdmin from 'firebase-admin';

const configuredStorageBucket = process.env.FIREBASE_STORAGE_BUCKET;
const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

if (!configuredStorageBucket && process.env.NODE_ENV === 'production') {
	throw new Error('FIREBASE_STORAGE_BUCKET is required');
}

const storageBucket = configuredStorageBucket || 'local-development.invalid';
const serviceAccount = serviceAccountJson ? JSON.parse(serviceAccountJson) : undefined;

if (serviceAccount?.private_key) {
	serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
}

const credential = serviceAccountJson
	? firebaseAdmin.credential.cert(serviceAccount as firebaseAdmin.ServiceAccount)
	: firebaseAdmin.credential.applicationDefault();

firebaseAdmin.initializeApp({ credential, storageBucket });

export const firebaseAdminStorage = firebaseAdmin.storage().bucket();
