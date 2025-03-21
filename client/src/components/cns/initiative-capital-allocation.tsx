import { Button } from "../ui/button";
import { formatEther, parseEther } from "viem";
import { Badge } from "../ui/badge";
import { Address } from "./address";
import { useSendTransaction, useAccount, useWriteContract } from "wagmi";
import { CNS_WALLET_ADDRESS } from "../../lib/viem-utils";
import { InitiativeScore } from "./cns-initiative-score";
import { InitiativeAbi } from "../../abi/Initiative.abi";
import { useState } from "react";

export function InitiativeCapitalAllocation({
    initiative,
}: {
    initiative: any;
}) {
    const { isConnected, address } = useAccount();
    const { sendTransaction } = useSendTransaction();
    const { writeContractAsync } = useWriteContract();
    const [teamMembers, setTeamMembers] = useState<`0x${string}`[]>([]);

    if (
        initiative.ideator !== "0x0000000000000000000000000000000000000000" &&
        !teamMembers.includes(initiative.ideator)
    )
        teamMembers.push(initiative.ideator);
    if (
        initiative.instigator !==
            "0x0000000000000000000000000000000000000000" &&
        !teamMembers.includes(initiative.instigator)
    )
        teamMembers.push(initiative.instigator);

    function getRole(initiative: any, address: `0x${string}`): string {
        return initiative.instigator === address
            ? "instigator"
            : initiative.ideator === address
            ? "ideator"
            : "member";
    }

    async function joinTeam() {
        await writeContractAsync({
            address: import.meta.env.VITE_CNS_INITIATIVE_CONTRACT_ADDRESS,
            abi: InitiativeAbi,
            functionName: "addTeamMember",
            args: [initiative.initiativeId, address],
        });
        if (address && !teamMembers.includes(address)) {
            setTeamMembers([...teamMembers, address]);
        }
    }

    return (
        <div className="grid grid-cols-3 gap-4 border border-blue-500 rounded-lg p-4 ">
            <div className="grid col-span-2">
                <div className="font-bold mb-5">{initiative.title}</div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <div className="flex text-xs text-gray-400 uppercase mb-2">
                            Description
                        </div>
                        <div className="text-sm">
                            {initiative.description?.substring(0, 200)}
                            {initiative.description?.length > 100 && "..."}
                        </div>
                    </div>
                    <div>
                        <div className="flex text-xs text-gray-400 uppercase mb-2">
                            Team
                        </div>
                        <div>
                            {teamMembers.map((m) => {
                                return (
                                    <div key={m} className="flex gap-3">
                                        <div>
                                            <Address
                                                address={m as `0x${string}`}
                                                showFullAddress={false}
                                            />
                                        </div>
                                        <div>
                                            <Badge className="">
                                                {getRole(initiative, m)}
                                            </Badge>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 items-center">
                    <div className="flex text-xl">
                        <div className="mr-4">Allocated</div>
                        <div className="font-bold">
                            Ξ{" "}
                            {formatEther(initiative.balance ?? 0n)?.substring(
                                0,
                                5
                            )}
                        </div>
                    </div>
                    <div className="flex">
                        <InitiativeScore score={initiative.score ?? 1n} />
                    </div>
                </div>

                <div>
                    <Button
                        className="w-full bg-blue-600 text-white font-bold"
                        disabled={!isConnected}
                        onClick={() => {
                            joinTeam();
                        }}
                    >
                        {isConnected ? "Join Team" : "Connect Wallet to Join"}
                    </Button>
                </div>
                <div>
                    <Button
                        className="w-full bg-yellow-500 text-sm font-bold"
                        onClick={() => {
                            sendTransaction({
                                to: CNS_WALLET_ADDRESS,
                                value: parseEther("0.05"),
                            });
                        }}
                        disabled={!isConnected}
                    >
                        {isConnected
                            ? "Allocate Funds"
                            : "Connect Wallet to Allocate Funds"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
