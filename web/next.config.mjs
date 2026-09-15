import { withPayload } from "@payloadcms/next/withPayload";

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["192.168.18.130"],
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
