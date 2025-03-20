import { linea } from "viem/chains";
import { useEnsName } from "wagmi";
import { shortenAddress } from "../../lib/utils";

export function Address({
    address,
    showFullAddress = false,
}: {
    address: `0x${string}`;
    showFullAddress: boolean;
}) {
    const { data: ensName } = useEnsName({ address, chainId: linea.id }); // always checking against mainnet
    return (
        <span>
            {ensName || (showFullAddress ? address : shortenAddress(address))}
        </span>
    );
}
