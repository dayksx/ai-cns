import { useEffect } from "react";
import { useState } from "react";
import { getCnsEthBalance } from "../../lib/viem-utils";
import { formatEther } from "viem";

export function CnsTreasury({ treasury }: { treasury: any }) {
    const [balance, setBalance] = useState<bigint>(0n);
    useEffect(() => {
        getCnsEthBalance().then((ethBalance) => {
            setBalance(ethBalance);
        });
    }, []);

    return (
        <div className="flex flex-col gap-4 border border-gray-700 rounded-lg p-4  ">
            <span className="text-xl font-bold">Finance</span>
            <div className="flex flex-row items-center gap-2">
                <span className="text-xl">Current Balance: </span>
                <div className="flex flex-col text-2xl font-bold gap-2">
                    Ξ {formatEther(balance)?.substring(0, 5)}
                </div>
            </div>
            <div className="flex flex-col text-xl gap-2">
               
            </div>
            <div className="flex flex-col gap-2">ETH in/out txs</div>
        </div>
    );
}
