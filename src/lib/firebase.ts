import { getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getMessaging, isSupported, type Messaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? '',
};

export const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY ?? '';

export const PUSH_FID_STORAGE_KEY = 'push_fid';

/**
 * Push é opcional: sem as envs o app roda igual, só não oferece notificação.
 */
export const isPushConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.messagingSenderId &&
  firebaseConfig.appId &&
  VAPID_KEY
);

const getFirebaseApp = (): FirebaseApp => {
  const [existing] = getApps();
  return existing ?? initializeApp(firebaseConfig);
};

/**
 * Retorna o client de messaging, ou null quando o browser não suporta (iOS
 * fora do modo standalone, Firefox privado, SSR...).
 */
export const getMessagingClient = async (): Promise<Messaging | null> => {
  if (!isPushConfigured || typeof window === 'undefined') return null;
  if (!(await isSupported())) return null;

  return getMessaging(getFirebaseApp());
};

/**
 * O service worker é um arquivo estático em /public, então não enxerga
 * process.env — a config vai por query string na URL de registro.
 */
export const messagingSwUrl = (): string => {
  const params = new URLSearchParams({
    apiKey: firebaseConfig.apiKey,
    projectId: firebaseConfig.projectId,
    messagingSenderId: firebaseConfig.messagingSenderId,
    appId: firebaseConfig.appId,
  });

  return `/firebase-messaging-sw.js?${params.toString()}`;
};
