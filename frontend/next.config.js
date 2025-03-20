module.exports = {
    env: {
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL, // Ensure using NEXT_PUBLIC prefix for client-side access
    },
    webpack: (config, { isServer }) => {
        if (!isServer) {
          config.resolve.fallback = {
            process: require.resolve('process/browser'), // Polyfill `process` for client-side
          };
        }
        return config;
      },
  };

  