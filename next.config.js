/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config, options) => {
    config.module.rules.push({
      test: /node_modules[\\|/]code-block-writer[\\|/]umd[\\|/]/,
      use: { loader: "umd-compat-loader" },
    })
    config.module.noParse = [
      require.resolve("@ts-morph/common/dist/typescript.js"),
    ]

    return config
  },
}

module.exports = nextConfig
