import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      // PWA manifest 설정
      manifest: {
        name: "petfit",
        short_name: "petfit",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#ffffff",
        start_url: "/",
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      // 개발 서버에서 PWA 기능 동작하도록 함
      devOptions: {
        enabled: true,
      },
    }),
  ],
});
