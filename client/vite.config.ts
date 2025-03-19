import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import viteCompression from "vite-plugin-compression";
import path from "node:path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const envDir = path.resolve(__dirname, "..");
    const env = loadEnv(mode, envDir, "");
    return {
        plugins: [
            react(),
            viteCompression({
                algorithm: "brotliCompress",
                ext: ".br",
                threshold: 1024,
            }),
        ],
        clearScreen: false,
        envDir,
        define: {
            "import.meta.env.VITE_SERVER_PORT": JSON.stringify(
                env.SERVER_PORT || "3000"
            ),
            "import.meta.env.VITE_SERVER_URL": JSON.stringify(
                env.SERVER_URL || "http://localhost"
            ),
            "import.meta.env.VITE_SERVER_BASE_URL": JSON.stringify(
                env.SERVER_BASE_URL
            ),
            "import.meta.env.VITE_LINEA_RPC_URL": JSON.stringify(
                env.LINEA_RPC_URL
            ),
            "import.meta.env.VITE_LINEA_SEPOLIA_RPC_URL": JSON.stringify(
                env.LINEA_SEPOLIA_RPC_URL
            ),
            "import.meta.env.VITE_CNS_AGREEMENT_CONTRACT_ADDRESS":
                JSON.stringify(env.CNS_AGREEMENT_CONTRACT_ADDRESS),
            "import.meta.env.VITE_CNS_CONSTITUTION_HASH": JSON.stringify(
                env.CNS_CONSTITUTION_HASH
            ),
        },
        build: {
            outDir: "dist",
            minify: true,
            cssMinify: true,
            sourcemap: false,
            cssCodeSplit: true,
        },
        resolve: {
            alias: {
                "@": "/src",
            },
        },
    };
});
