import { linea } from "viem/chains";
import { useEnsName } from "wagmi";
import { shortenAddress } from "../../lib/utils";

const demoEnsTweakForMembers = [
    {
        address: "0x65a4CeC9f1c6060f3b987d9332Bedf26e8E86D17",
        ensName: "satya.linea.eth",
    },
    {
        address: "0x17757544f255c78D3492bc2534DBfaDD7C1bD007",
        ensName: "fred.linea.eth",
    },
    {
        address: "0x2754265A82705CEe4Fca6343a5cdD36850348780",
        ensName: "jb.linea.eth",
    },
    {
        address: "0x44dc4e3309b80ef7abf41c7d0a68f0337a88f044",
        ensName: "dayan.linea.eth",
    },
];

export function Address({
    address,
    showFullAddress = false,
}: {
    address: `0x${string}`;
    showFullAddress: boolean;
}) {
    const { data: ensName } = useEnsName({ address, chainId: linea.id }); // always checking against mainnet
    let ensNameToDisplay = ensName;
    if (!ensNameToDisplay) {
        // temp tweak for demo
        const demoEns = demoEnsTweakForMembers.find(
            (member) => member.address === address
        );
        ensNameToDisplay = demoEns?.ensName;
    }
    return (
        <span className="text-sm">
            {ensNameToDisplay ||
                (showFullAddress ? address : shortenAddress(address))}
        </span>
    );
}
