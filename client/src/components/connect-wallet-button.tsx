import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Button } from "./ui/button";
import { mmConnector } from "../lib/wagmi";
import { Address } from "./cns/address";

export function ConnectWalletButton() {
    const { connect } = useConnect();
    const { disconnect } = useDisconnect();
    const { address, isConnected } = useAccount();
    if (isConnected) {
        return (
            <div className="flex flex-row items-center gap-2">
                <Address address={address ?? "0x"} showFullAddress={false} />
                <Button variant="secondary" onClick={() => disconnect()}>
                    Disconnect
                </Button>
            </div>
        );
    }
    return (
        <Button
            variant="secondary"
            onClick={() => connect({ connector: mmConnector })}
        >
            Connect Wallet
        </Button>
    );
}
