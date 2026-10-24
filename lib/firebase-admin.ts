import { getApps, getApp, initializeApp, cert, applicationDefault } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';

// Initialize Firebase Admin App if not already initialized
const app = getApps().length > 0 
  ? getApp() 
  : initializeApp({
      // On Vercel, we can't use a local JSON file path. We must use environment variables directly.
      credential: process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY
        ? cert({
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'sbagiamu-webapps',
            clientEmail: process.env.GOOGLE_CLIENT_EMAIL,
            // Handle newlines in the private key string from Vercel env
            privateKey: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          })
        : applicationDefault(),
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'sbagiamu-webapps',
    });

export const adminMessaging = getMessaging(app);
