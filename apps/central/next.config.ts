import type { NextConfig } from "next";
import { withAxiom } from "next-axiom";
const nextConfig: NextConfig = {
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
