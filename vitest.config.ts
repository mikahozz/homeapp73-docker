import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "happy-dom",
    include: ["homeclient/src/components/ElectricityPrice.test.tsx"],
    restoreMocks: true,
    clearMocks: true,
  },
});
