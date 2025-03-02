import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { mockApiPlugin } from "./src/mockupMiddleware";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), mockApiPlugin()],
  server: {
    port: 3000,
  },
  base: "./", // This makes asset paths relative
  build: {
    assetsDir: "assets",
    rollupOptions: {
      output: {
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },
  },
});
