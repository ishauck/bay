import type { NextConfig } from "next";
import { withAxiom } from "next-axiom";
const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
  },
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/login",
        permanent: true,
      },
    ];
  }
};

export default withAxiom(nextConfig);
