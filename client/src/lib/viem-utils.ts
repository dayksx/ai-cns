import { createPublicClient, fallback, http, parseAbiItem } from "viem";
import { lineaSepolia } from "viem/chains";

const LINEA_SEPOLIA_START_BLOCK = 10549643n; // when CNS project launched
const LINEA_START_BLOCK = 17000000n; // when CNS project launched
const CNS_WALLET_ADDRESS = "0x01f8e269cadcd36c945f012d2eeae814c42d1159";

const getFallbackTransports = (rpcUrls: string[]) =>
    rpcUrls.map((url) => http(url));

const publicClient = createPublicClient({
    //FIXME only works with Linea Sepolia atm
    chain: lineaSepolia,
    transport: fallback([
        http(),
        ...getFallbackTransports([import.meta.env.VITE_LINEA_SEPOLIA_RPC_URL]),
    ]),
});

export async function fetchAgreementSignedEvents(useTestnet = true) {
    //FIXME only works with Linea Sepolia atm
    console.log(
        "Getting netizens from " +
            import.meta.env.VITE_CNS_AGREEMENT_CONTRACT_ADDRESS
    );
    const logs = await publicClient.getLogs({
        address: import.meta.env.VITE_CNS_AGREEMENT_CONTRACT_ADDRESS,
        event: parseAbiItem(
            "event AgreementSigned(address indexed user, string userProfileType, string userNatureAgent,bytes32 constitutionHash, uint256 etherAmount, uint256 timestamp)"
        ),
        fromBlock: useTestnet ? LINEA_SEPOLIA_START_BLOCK : LINEA_START_BLOCK,
        toBlock: "latest",
    });
    return logs;
}

export async function getCnsEthBalance() {
    return await publicClient.getBalance({
        address: CNS_WALLET_ADDRESS,
    });
}
