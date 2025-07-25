import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // Enable latest Next.js features (removed serverComponentsExternalPackages as it's moved)
  },
  
  // Server external packages (moved from experimental)
  serverExternalPackages: ['@supabase/supabase-js'],
  
  // Redirect old URLs to new language-based URLs
  async redirects() {
    return [
      // Redirect old app routes to new [locale] structure
      {
        source: '/app/:path*',
        has: [
          {
            type: 'header',
            key: 'accept-language',
            value: '^de.*',
          },
        ],
        destination: '/de/app/:path*',
        permanent: false,
      },
      {
        source: '/app/:path*',
        has: [
          {
            type: 'header',
            key: 'accept-language', 
            value: '^es.*',
          },
        ],
        destination: '/es/app/:path*',
        permanent: false,
      },
      // Default redirect for app routes (English)
      {
        source: '/app/:path*',
        destination: '/en/app/:path*',
        permanent: false,
      },
      
      // Redirect old auth routes to new [locale] structure  
      {
        source: '/auth/:path*',
        has: [
          {
            type: 'header',
            key: 'accept-language',
            value: '^de.*',
          },
        ],
        destination: '/de/auth/:path*',
        permanent: false,
      },
      {
        source: '/auth/:path*',
        has: [
          {
            type: 'header',
            key: 'accept-language', 
            value: '^es.*',
          },
        ],
        destination: '/es/auth/:path*',
        permanent: false,
      },
      // Default redirect for auth routes (English)
      {
        source: '/auth/:path*',
        destination: '/en/auth/:path*',
        permanent: false,
      },
      
      // Redirect old classes routes to new [locale] structure
      {
        source: '/classes/:path*',
        has: [
          {
            type: 'header',
            key: 'accept-language',
            value: '^de.*',
          },
        ],
        destination: '/de/classes/:path*',
        permanent: false,
      },
      {
        source: '/classes/:path*',
        has: [
          {
            type: 'header',
            key: 'accept-language', 
            value: '^es.*',
          },
        ],
        destination: '/es/classes/:path*',
        permanent: false,
      },
      // Default redirect for classes routes (English)
      {
        source: '/classes/:path*',
        destination: '/en/classes/:path*',
        permanent: false,
      },
      
      // Redirect legal pages to new [locale] structure
      {
        source: '/privacy',
        has: [
          {
            type: 'header',
            key: 'accept-language',
            value: '^de.*',
          },
        ],
        destination: '/de/privacy',
        permanent: false,
      },
      {
        source: '/privacy',
        has: [
          {
            type: 'header',
            key: 'accept-language',
            value: '^es.*',
          },
        ],
        destination: '/es/privacy',
        permanent: false,
      },
      {
        source: '/privacy',
        destination: '/en/privacy',
        permanent: false,
      },
      {
        source: '/terms',
        has: [
          {
            type: 'header',
            key: 'accept-language',
            value: '^de.*',
          },
        ],
        destination: '/de/terms',
        permanent: false,
      },
      {
        source: '/terms',
        has: [
          {
            type: 'header',
            key: 'accept-language',
            value: '^es.*',
          },
        ],
        destination: '/es/terms',
        permanent: false,
      },
      {
        source: '/terms',
        destination: '/en/terms',
        permanent: false,
      },
      {
        source: '/support',
        has: [
          {
            type: 'header',
            key: 'accept-language',
            value: '^de.*',
          },
        ],
        destination: '/de/support',
        permanent: false,
      },
      {
        source: '/support',
        has: [
          {
            type: 'header',
            key: 'accept-language',
            value: '^es.*',
          },
        ],
        destination: '/es/support',
        permanent: false,
      },
      {
        source: '/support',
        destination: '/en/support',
        permanent: false,
      },
      
      // Redirect root with language detection to new [locale] structure
      {
        source: '/',
        has: [
          {
            type: 'header',
            key: 'accept-language',
            value: '^de.*',
          },
        ],
        destination: '/de',
        permanent: false,
      },
      {
        source: '/',
        has: [
          {
            type: 'header',
            key: 'accept-language', 
            value: '^es.*',
          },
        ],
        destination: '/es',
        permanent: false,
      },
      // Default redirect for root (English)
      {
        source: '/',
        destination: '/en',
        permanent: false,
      },
    ]
  },

  // Disable static optimization for better Netlify compatibility
  output: 'standalone',
  
  // Environment variable mapping
  env: {
    // Map your custom environment variable names to the standard Supabase names
    NEXT_PUBLIC_SUPABASE_URL: process.env.PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },

  // Image optimization for Netlify
  images: {
    unoptimized: true, // Use Netlify's image optimization instead
  },
};

export default nextConfig;
