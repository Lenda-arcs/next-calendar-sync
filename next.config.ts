import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Disable static optimization for better Netlify compatibility
  output: 'standalone',
  
  // Environment variable mapping
  env: {
    // Map your custom environment variable names to the standard Supabase names
    NEXT_PUBLIC_SUPABASE_URL: process.env.PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },

  // External packages for server components
  serverExternalPackages: ['@supabase/supabase-js'],

  // Image optimization for Netlify
  images: {
    unoptimized: true, // Use Netlify's image optimization instead
  },
};

export default nextConfig;
