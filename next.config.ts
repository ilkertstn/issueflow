/** @type {import('next').NextConfig} */
const nextConfig = {};

if (process.env.VERCEL) {
  console.log("ENV CHECK (build):", {
    hasApiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    hasProjectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    hasAppId: !!process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  });
}

module.exports = nextConfig;
