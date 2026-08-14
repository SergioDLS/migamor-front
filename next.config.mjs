/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack(config) {
    // Los SVG de marca se importan como componentes React para poder
    // recolorearlos con currentColor y componerlos dentro de <pattern>.
    //
    // No basta con añadir una regla: Next trae su propio loader de assets para
    // .svg y hay que excluirlo explícitamente, o los dos compiten y el import
    // termina resolviendo a una URL en vez de a un componente.
    const fileLoaderRule = config.module.rules.find(
      (rule) => rule.test?.test?.('.svg'),
    );

    config.module.rules.push(
      // `import url from './x.svg?url'` sigue devolviendo la URL.
      { ...fileLoaderRule, test: /\.svg$/i, resourceQuery: /url/ },
      // El resto de imports de .svg devuelven un componente React.
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...(fileLoaderRule.resourceQuery?.not ?? []), /url/] },
        use: [{ loader: '@svgr/webpack', options: { svgo: false } }],
      },
    );

    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
};

export default nextConfig;
