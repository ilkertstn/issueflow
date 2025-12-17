if (process.env.VERCEL) {
  console.log("ENV CHECK (build):", {
    apiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    appId: !!process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    messagingSenderId: !!process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    storageBucket: !!process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    databaseURL: !!process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  });
}
