/** @type {import('next').NextConfig} */
const nextConfig = {

    experimental: {
        externalDir: true,
    },
    async rewrites() {
        return [
            {
                source: '/api',
                destination: '/api/graphql',
            },
        ];
    },
    async headers() {
        return [
            {
                source: '/api',
                headers: [
                    {
                        key: 'Access-Control-Allow-Origin',
                        value: '*',
                    },
                    {
                        key: 'Access-Control-Allow-Methods',
                        value: 'GET, POST, PUT, DELETE, OPTIONS',
                    },
                    {
                        key: 'Access-Control-Allow-Headers',
                        value: 'Content-Type, Accept, Accept-Language, Accept-Encoding',
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
