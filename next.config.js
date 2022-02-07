const withTM = require('next-transpile-modules')([]);

const env = {
  CONTRACT: process.env.NEXT_CONTRACT || "0x71EAa691b6e5D5E75a3ebb36D4f87CBfb23C87b0",
  HOST: process.env.NEXT_HOST || "https://cmdrnft.github.io",
}
module.exports = withTM({
  reactStrictMode: true,
  images: {
    domains: [new URL(env.NEXT_HOST).hostname],
  },
  env
});
