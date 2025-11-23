import { defineConfig } from "eslint/config";

import { baseConfig } from "@bibliogost/eslint-config/base";
import { reactConfig } from "@bibliogost/eslint-config/react";

export default defineConfig(
  {
    ignores: ["dist/**"],
  },
  baseConfig,
  reactConfig,
);
