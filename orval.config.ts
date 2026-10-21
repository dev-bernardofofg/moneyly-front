import { defineConfig } from 'orval';

export default defineConfig({
  moneyly: {
    input: {
      target: '../moneyly-back/openapi.json',
    },
    output: {
      mode: 'tags-split',
      target: './src/api/generated/hooks',
      client: 'react-query',
      httpClient: 'axios',
      override: {
        mutator: {
          path: './src/lib/axios-instance.ts',
          name: 'customInstance',
        },
        query: {
          options: {
            staleTime: 10000,
          },
        },
      },
    },
  },
});
