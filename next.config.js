const withTM = require('next-transpile-modules')([]);
const isProd = process.env.NODE_ENV === 'production'


const env = {
  NEXT_CONTRACT: process.env.NEXT_CONTRACT || "0x71EAa691b6e5D5E75a3ebb36D4f87CBfb23C87b0",
  NEXT_IPFS_GATEWAY: process.env.NEXT_IPFS_GATEWAY || "https://ipfs.infura.io/ipfs/",
  NEXT_GITHUB_PAGES_REPO: process.env.NEXT_GITHUB_PAGES_REPO || '',
}
module.exports = withTM({
  reactStrictMode: true,
  basePath: isProd ? `/${env.NEXT_GITHUB_PAGES_REPO}` : '',
  assetPrefix: isProd ? `/${env.NEXT_GITHUB_PAGES_REPO}/` : '',
  images: {
    domains: [new URL(env.NEXT_IPFS_GATEWAY).hostname, ...process.env.NEXT_GITHUB_PAGES_HOST ? [new URL(process.env.NEXT_GITHUB_PAGES_HOST).hostname] : []],
  },
  env
});
