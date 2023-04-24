/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    GOOGLE_CLOUD_API_KEY: process.env.GOOGLE_CLOUD_API_KEY,
    SPEECH_KEY: process.env.SPEECH_KEY,
    SPEECH_REGION: process.env.SPEECH_REGION,
    STABLE_API_KEY: process.env.STABLE_API_KEY,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE: process.env.SUPABASE_SERVICE_ROLE,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  },
}

module.exports = nextConfig
