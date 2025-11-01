/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: {
            bodySizeLimit: '2mb', // Increase body size limit for file uploads in server actions
        },
    },
};

export default nextConfig;
