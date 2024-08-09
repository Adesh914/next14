/** @type {import('next').NextConfig} */
const nextConfig = {

    experimental: {
        externalDir: true,
    },
    async rewrites() {
        return [
            {
                source: '/old-path',
                destination: '/new-path',
            },
            // {
            //     source: '/api/:path*',
            //     destination: 'https://api.example.com/:path*',
            // },
        ];
    },
};

export default nextConfig;
