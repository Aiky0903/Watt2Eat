import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/server": {
        target: process.env.VITE_API_BASE_URL,
      },
    },
  },
  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer()],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
