import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [react(), svgr()],
  base: "/",
  server: {
    proxy: {
      "/api": {
        target: "https://api.novextask.ru",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq, req) => {
            console.log("Proxying:", req.url, "->", proxyReq.path);
          });
          proxy.on("error", (err) => {
            console.log("Proxy error:", err);
          });
        },
      },
    },
  },
});
