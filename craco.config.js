const webpack = require("webpack");

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      return {
        ...webpackConfig,
        plugins: [
          ...webpackConfig.plugins,
          new webpack.ProvidePlugin({
            Buffer: ["buffer", "Buffer"],
          }),
        ],
        resolve: {
          ...webpackConfig.resolve,
          fallback: {
            ...webpackConfig.resolve.fallback,
            crypto: require.resolve("crypto-browserify"),
            stream: require.resolve("stream-browserify"),
            buffer: require.resolve("buffer"),
          },
        },
      };
    },
  },
};
