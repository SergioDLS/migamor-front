/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack(config) {
    // Los SVG de marca se importan como componentes React para poder
    // recolorearlos con currentColor y componerlos dentro de <pattern>.
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [{ loader: '@svgr/webpack', options: { svgo: false } }],
    });
    return config;
  },
};

export default nextConfig;
