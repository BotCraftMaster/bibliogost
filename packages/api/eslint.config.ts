import { defineConfig } from "eslint/config";

import { baseConfig } from "@bibliogost/eslint-config/base";

export default defineConfig(
  {
    ignores: ["dist/**"],
  },
  baseConfig,
);
