/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false  ,
  env: {
    GOOGLE_CLOUD_API_KEY: process.env.GOOGLE_CLOUD_API_KEY,
    SPEECH_KEY: process.env.SPEECH_KEY,
    SPEECH_REGION: process.env.SPEECH_REGION,
    STABLE_API_KEY: process.env.STABLE_API_KEY,
  },
}

module.exports = nextConfig
