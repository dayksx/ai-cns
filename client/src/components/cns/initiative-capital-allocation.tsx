import { Star } from "lucide-react";
import { shortenAddress } from "../../lib/utils";
import { Button } from "../ui/button";
import { formatEther } from "viem";
import { Badge } from "../ui/badge";
import { Address } from "./address";

export function InitiativeCapitalAllocation({
    initiative,
}: {
    initiative: any;
}) {
    const randomTeamMembers: `0x${string}`[] = [];
    if (initiative.ideator !== "0x0000000000000000000000000000000000000000")
        randomTeamMembers.push(initiative.ideator);
    if (initiative.instigator !== "0x0000000000000000000000000000000000000000")
        randomTeamMembers.push(initiative.instigator);

    function getRole(initiative: any, address: `0x${string}`): string {
        return initiative.instigator === address
            ? "instigator"
            : initiative.ideator === address
            ? "ideator"
            : "member";
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
                            {randomTeamMembers.map((m) => {
                                return (
                                    <div key={m} className="flex gap-3">
                                        <div>
                                            <Address address={m as `0x${string}`} showFullAddress={false} />
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
                        <div className="mr-4">AI score</div>
                        <div className="flex gap-1">
                            <Star className="text-yellow-500" />
                            <Star className="text-yellow-500" />
                            <Star className="text-gray-500" />
                        </div>
                    </div>
                </div>

                <div>
                    <Button className="w-full bg-blue-600 text-white font-bold">
                        Join Team
                    </Button>
                </div>
                <div>
                    <Button className="w-full bg-yellow-500 text-lg font-bold">
                        Allocate Funds
                    </Button>
                </div>
            </div>
        </div>
    );
}
