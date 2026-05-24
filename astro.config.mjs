import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://example.com',

  markdown: {
    shikiConfig: {
      theme: 'css-variables',
      wrap: true,
    },
  },

  adapter: cloudflare(),
});