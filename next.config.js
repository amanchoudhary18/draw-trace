/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = {
  output: "export",

  images: {
    unoptimized: true,
    disableStaticImages: true,
  },
};
