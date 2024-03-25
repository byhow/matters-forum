import { withAxiom } from 'next-axiom';
/** @type {import('next').NextConfig} */
const nextConfig = withAxiom({
  rewrites: () => [
    {
      source: "/newest",
      destination: "/?newest=1",
    },
    {
      source: "/trend",
      destination: "/?trend=1",
    },
    {
      source: '/priciest',
      destination: '/?priciest=1'
    }
  ]
});

export default nextConfig;
