import { defineConfig } from "orval";

export default defineConfig({
  moneyly: {
    input: {
      target: "./openapi.json",
    },
    output: {
      mode: "tags-split",
      target: "./src/app/(resources)/(generated)/hooks",
      client: "react-query",
      prettier: true,
      httpClient: "axios",
      override: {
        mutator: {
          path: "./src/app/(utils)/axios-instance.ts",
          name: "customInstance",
        },
        query: {
          useQuery: true,
          useInfinite: false,
          options: {
            staleTime: 10000,
          },
        },
      },
    },
  },
});
