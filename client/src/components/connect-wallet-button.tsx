import { useAccount,useConnect, useDisconnect } from "wagmi";
import { Button } from "./ui/button";
import { mmConnector } from "../lib/wagmi";

export function ConnectWalletButton() {
    const {connect} = useConnect();
    const { disconnect } = useDisconnect();
    const { address, isConnected } = useAccount();
    if(isConnected) {
        return (
            <div className="flex flex-row items-center gap-2">
                <div className="">{address}</div>
                <Button variant="secondary" onClick={() => disconnect()}>Disconnect</Button>
            </div>
        )
    }
    return (
        <Button variant="secondary" onClick={() => connect({ connector: mmConnector })}>Connect Wallet</Button>
    );
}