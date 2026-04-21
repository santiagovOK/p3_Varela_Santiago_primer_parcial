import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  server: {
    port: 5173,
    open: "/src/pages/auth/login/login.html",
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        login: resolve(__dirname, "src/pages/auth/login/login.html"),
        registro: resolve(__dirname, "src/pages/auth/registro/registro.html"),
        adminHome: resolve(__dirname, "src/pages/admin/home/home.html"),
        clientHome: resolve(__dirname, "src/pages/client/home/home.html"),
      },
    },
  },
});