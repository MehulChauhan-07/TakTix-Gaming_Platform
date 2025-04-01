import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  // Get the backend URLs from environment
  const backendUrl = env.VITE_BACKEND_URL || "http://localhost:5000";
  const wsBackendUrl = env.VITE_WS_BACKEND_URL || "ws://localhost:5000";

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@assets": path.resolve(__dirname, "./src/assets"),
        "@components": path.resolve(__dirname, "./src/components"),
        "@hooks": path.resolve(__dirname, "./src/hooks"),
        "@lib": path.resolve(__dirname, "./src/lib"),
        "@pages": path.resolve(__dirname, "./src/pages"),
        "@styles": path.resolve(__dirname, "./src/styles"),
        "@services": path.resolve(__dirname, "./src/services"),
        "@types": path.resolve(__dirname, "./src/types"),
        "@utils": path.resolve(__dirname, "./src/utils"),
      },
    },
    server: {
      port: 5173,
      host: true, // Needed for devtunnel access
      proxy: {
        "/api": {
          target: backendUrl,
          changeOrigin: true,
          secure: false,
        },
        "/socket.io": {
          target: wsBackendUrl,
          ws: true,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    define: {
      __FRONTEND_URL__: JSON.stringify(
        process.env.VITE_APP_URL || "https://d4xxkt7f-5173.inc1.devtunnels.ms"
      ),
      __BACKEND_URL__: JSON.stringify(backendUrl),
      __WS_BACKEND_URL__: JSON.stringify(wsBackendUrl),
    },
  };
});
