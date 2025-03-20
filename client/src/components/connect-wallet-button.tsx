import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Button } from "./ui/button";
import { mmConnector } from "../lib/wagmi";
import { useEffect, useState } from "react";
import { checkIsNetizen } from "../lib/cns/get-cns-netizens";
import { shortenAddress } from "../lib/utils";
import { Badge } from "./ui/badge";

export function ConnectWalletButton() {
    const { connect } = useConnect();
    const { disconnect } = useDisconnect();
    const { address, isConnected } = useAccount();
    const [isNetizen, setIsNetizen] = useState(false);
    useEffect(() => {
        if (isConnected && address) {
            checkIsNetizen(address).then((bool) => {
                setIsNetizen(bool);
            });
        }
    }, [address]);

    if (isConnected) {
        return (
            <div className="flex flex-row items-center gap-2">
                {isNetizen && (
                    <Badge className="uppercase bg-yellow-500">netizen</Badge>
                )}
                {!isNetizen && (
                    <Button
                        className="uppercase bg-yellow-500"
                        onClick={() =>
                            (window.location.href = "/naturalization")
                        }
                    >
                        become a CNS netizen
                    </Button>
                )}
                <div className="text-blue-200">
                    {shortenAddress(address ?? "0x")}
                </div>
                <Button
                    variant="secondary"
                    className="bg-gray-600"
                    onClick={() => disconnect()}
                >
                    Disconnect
                </Button>
            </div>
        );
    }
    return (
        <>
            <Button
                variant="secondary"
                onClick={() => connect({ connector: mmConnector })}
            >
                Connect Wallet
            </Button>
        </>
    );
}
