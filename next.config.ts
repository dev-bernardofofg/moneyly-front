import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/auth",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
