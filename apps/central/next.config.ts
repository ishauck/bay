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
      {
        source: "/app/:org/forms",
        destination: "/app/:org/new/form",
        permanent: true,
      },
    ];
  }
};

export default withAxiom(nextConfig);
