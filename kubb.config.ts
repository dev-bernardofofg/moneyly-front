import { defineConfig } from '@kubb/core';
import { pluginOas } from '@kubb/plugin-oas';
import { pluginTs } from '@kubb/plugin-ts';

export default defineConfig({
  input: {
    path: '../moneyly-back/openapi.json',
  },
  output: {
    path: './src/app/(resources)/(generated)',
  },
  plugins: [
    pluginOas(),
    pluginTs({
      output: {
        path: 'types',
      },
    }),
  ],
});
