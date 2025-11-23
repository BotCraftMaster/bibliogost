import { defineConfig } from "eslint/config";

import { baseConfig, restrictEnvAccess } from "@bibliogost/eslint-config/base";
import { nextjsConfig } from "@bibliogost/eslint-config/nextjs";
import { reactConfig } from "@bibliogost/eslint-config/react";

export default defineConfig(
  {
    ignores: [".next/**"],
  },
  baseConfig,
  reactConfig,
  nextjsConfig,
  restrictEnvAccess,
);
