const withTM = require('next-transpile-modules')([]);
const isProd = process.env.NODE_ENV === 'production'


const env = {
  NEXT_CONTRACT: process.env.NEXT_CONTRACT || "0x71EAa691b6e5D5E75a3ebb36D4f87CBfb23C87b0",
  NEXT_HOST: process.env.NEXT_HOST || "https://cmdrnft.github.io",
  NEXT_IPFS_GATEWAY: process.env.NEXT_IPFS_GATEWAY || "https://ipfs.infura.io/ipfs/",
}
module.exports = withTM({
  reactStrictMode: true,
  basePath: isProd ? '/nft-collection-viewer' : '',
  assetPrefix: isProd ? '/nft-collection-viewer/' : '',
  images: {
    domains: [new URL(env.NEXT_IPFS_GATEWAY).hostname],
  },
  env
});
