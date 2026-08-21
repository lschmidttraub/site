import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://leost.xyz',
  markdown: {
    shikiConfig: {
      theme: 'css-variables',
      wrap: true,
    },
  },
});
