// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import tailwindcss from "@tailwindcss/vite";


// import playformCompress from '@playform/compress';

// https://astro.build/config
export default defineConfig({
    compressHTML:false,
    build: {
        // Prevent Astro from minifying HTML
        inlineStylesheets: 'never',
        
      },
      vite: {
        plugins:[tailwindcss()],
        build: {
          // Prevent JS minification
          minify: false,
          // Preserve line breaks and formatting
          cssMinify: false,

        },
    },
    site: 'https://example.com',
    integrations: [
      mdx(),
      // 	(await import("@playform/compress")).default({
      // 	CSS: false,
      // 	HTML: false,
      // 	Image: false,
      // 	JavaScript: false,
      // 	SVG: false,
      // }),
      sitemap(),
      react(),
    ],
});