import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [react(), svgr()],
  server: {
    proxy: {
      // Прокси для всех запросов к /api на Laravel сервер
      "/api": {
        target: "https://server-thinkpad-x220.tail44896d.ts.net",
        changeOrigin: true, // чтобы браузер думал, что запрос с того же origin
        secure: false, // если dev-сервер Laravel с самоподписанным сертификатом
      },
    },
  },
});
