import { defineConfig } from "@kubb/core";
import { pluginOas } from "@kubb/plugin-oas";
import { pluginTs } from "@kubb/plugin-ts";
// pluginZod removido: zod gerado não é consumido (forms usam (resources)/(schemas) à mão)
// e o plugin quebra em `allOf:[{$ref},{nullable:true}]` do contrato back.

export default defineConfig({
  input: {
    path: "../moneyly-back/openapi.json",
  },
  output: {
    path: "./src/app/(resources)/(generated)",
  },
  plugins: [
    pluginOas(),
    pluginTs({
      output: {
        path: "types",
      },
    }),
  ],
});
