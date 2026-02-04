/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    "100.107.153.1",        // The raw IP
    "100.107.153.1:3000",   // The IP with port (safest to have both)
  ],
};

export default nextConfig;
