/** @type {import('next').NextConfig} */
const repoName = process.env.GITHUB_REPOSITORY
  ? `/${process.env.GITHUB_REPOSITORY.split("/")[1]}`
  : process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: repoName ? repoName : undefined,
  assetPrefix: repoName ? repoName : undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: repoName || "",
  },
  trailingSlash: true,
};

module.exports = nextConfig;
