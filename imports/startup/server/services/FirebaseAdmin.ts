import firebaseAdmin from 'firebase-admin';
// @ts-ignore
// import serviceAccount from '../../../../settings/app-21212-firebase-adminsdk-cvds-cce43csd32';

firebaseAdmin.initializeApp({
    // credential: firebaseAdmin.credential.cert('serviceAccountPath'),
    storageBucket: 'yourBucket.appspot.com'
});

export const firebaseAdminStorage = firebaseAdmin.storage().bucket();

export const BASE_URL_STORAGE='https://storage.googleapis.com';
