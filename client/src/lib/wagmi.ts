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

export const wagmiConfig = createConfig({
    chains: [linea, lineaSepolia],
    connectors: [mmConnector],
    transports: {
        [linea.id]: http(), //TODO add RPC  from .env for lineaSepolia
        [lineaSepolia.id]: http(), //TODO add RPC  from .env for lineaSepolia
    },
});
