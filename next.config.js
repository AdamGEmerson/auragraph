/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  serverRuntimeConfig: {
    // Will only be available on the server side
    clientSecret: process.env.CLIENT_SECRET,
    clientId: process.env.CLIENT_ID,
  },
  publicRuntimeConfig: {
    databaseApiUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    databasePublicAnon: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.scdn.co',
        port: '',
      },
    ],
  },

}

module.exports = nextConfig
