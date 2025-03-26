import { useEffect } from "react";
import { useState } from "react";
import { getCnsEthBalance, getCnsTokenBalance } from "../../lib/viem-utils";
import { formatEther } from "viem";
import { FinanceChart } from "./finance-chart";
import { SquareArrowOutUpRight } from "lucide-react";

export function CnsTreasury() {
    const [balance, setBalance] = useState<bigint>(0n);
    const [tokenBalance, setTokenBalance] = useState<bigint>(0n);
    useEffect(() => {
        getCnsEthBalance().then((ethBalance) => {
            setBalance(ethBalance);
        });
        getCnsTokenBalance().then((tokenBalance) => {
            setTokenBalance(tokenBalance);
        });
    }, []);

    return (
        <div className="flex flex-col gap-4 rounded-lg p-4  ">
            <span className="text-xl font-semibold text-gray-700 uppercase border-b pb-1">Financial</span>
            <div className="grid grid-cols-2 place-content-evenly items-center gap-4 mt-2">
                <div className="flex text-3xl font-bold justify-center gap-2 bg-gray-800 text-white rounded-lg p-8">
                    <span>Ξ {formatEther(balance)?.substring(0, 5)}</span>
                    <a href="https://sepolia.lineascan.build/address/0x01F8e269CADCD36C945F012d2EeAe814c42D1159" className="text-blue-500 hover:text-blue-400">
                        <SquareArrowOutUpRight className="w-4 h-4" />
                    </a>
                </div>
                <div className="flex text-3xl font-bold justify-center gap-2 bg-gray-800 text-white rounded-lg p-8">
                    <span>
                        $CNS {formatEther(tokenBalance)?.substring(0, 5)}
                    </span>
                    <a href="https://sepolia.lineascan.build/token/0xd2A2c346bF6A62235DBE9222F43d423024D7353D" className="text-blue-500 hover:text-blue-400">
                        <SquareArrowOutUpRight className="w-4 h-4" />
                    </a>
                </div>
            </div>
            <div>
                <FinanceChart />
            </div>
        </div>
    );
}
