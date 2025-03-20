import { fallback } from "viem";
import { http, createConfig } from "wagmi";
import { linea, lineaSepolia } from "wagmi/chains";
import { metaMask } from "wagmi/connectors";

export const mmConnector = metaMask({
    dappMetadata: {
        name: "CNS Dapp",
        url: "https://example.com",
        iconUrl: "https://example.com/favicon.ico",
    },
});

const getFallbackTransports = (rpcUrls: string[]) =>
    rpcUrls.map((url) => http(url));

export const wagmiConfig = createConfig({
    chains: [linea, lineaSepolia],
    connectors: [mmConnector],
    transports: {
        [linea.id]: fallback([
            http(),
            ...getFallbackTransports([import.meta.env.VITE_LINEA_RPC_URL]),
        ]),
        [lineaSepolia.id]: fallback([
            http(),
            ...getFallbackTransports([
                import.meta.env.VITE_LINEA_SEPOLIA_RPC_URL,
            ]),
        ]),
    },
});
