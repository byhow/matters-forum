/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: () => [
    {
      source: "/newest",
      destination: "/?newest=1",
    },
    {
      source: "/trend",
      destination: "/?trend=1",
    },
  ]
};

export default nextConfig;
