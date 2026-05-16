/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static HTML export — generates ./out folder for S3 upload
  output: 'export',

  // S3 + CloudFront route handling works best with trailing slashes
  // (a request for /about will resolve to /about/index.html)
  trailingSlash: true,

  // Disable Next.js Image Optimization API (requires a server)
  // For a static export, all images are served as-is from /public
  images: {
    unoptimized: true,
  },

  // Optional: set this if hosting at a sub-path (e.g. example.com/portfolio)
  // basePath: '',
};

module.exports = nextConfig;
