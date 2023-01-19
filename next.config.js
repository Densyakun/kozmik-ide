const { merge } = require('webpack-merge')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (
    config,
  ) => {
    return merge(config, {
      ignoreWarnings: [
        {
          module: /typescript/,
          message: /Critical dependency: the request of a dependency is an expression/,
        },
      ],
    })
  },
}

module.exports = nextConfig
