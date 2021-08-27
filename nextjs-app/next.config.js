module.exports = {
  reactStrictMode: true,
  webpack: (config) => {
    config.devtool = false;
    return config;
  },
};
