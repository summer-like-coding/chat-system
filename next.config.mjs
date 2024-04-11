import process from 'node:process'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  rewrites: async () => {
    return [
      {
        destination: `${process.env.SOCKETIO_SERVER_URL}${process.env.SOCKETIO_PATH}:path*`,
        source: `${process.env.SOCKETIO_PATH}:path*`,
      },
    ]
  },
}

export default nextConfig
