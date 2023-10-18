import { defineConfig } from "vitest/dist/config"

export default defineConfig({
  plugins: [],
  test: {
    environmentMatchGlobs: [["src/api/controller/tests/**", "prisma"]],
    dir: "src",
  },
})
