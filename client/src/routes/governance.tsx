import { Suspense, use, useEffect, useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { PageHeader } from "../components/page-header";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { getInitiatives } from "@/contracts/get-initiatives";
import { contractAddress, contractAbi } from "@/contracts/Initiative";
import { getVoteInfo } from "@/contracts/get-vote-info";

function InitiativesList({ dataPromise }: { dataPromise: Promise<any[]> }) {
    const initiatives = use(dataPromise);
    const { address } = useAccount();
    const [votes, setVotes] = useState<{ [key: string]: number }>({});
    const [voteTypes, setVoteTypes] = useState<{
        [key: string]: boolean | undefined;
    }>({});
    const [creditsUsed, setCreditsUsed] = useState<{ [key: string]: number }>(
        {}
    );
    const [userVoted, setUserVoted] = useState<{ [key: string]: boolean }>({});
    const { writeContract } = useWriteContract();

    useEffect(() => {
        if (address) {
            const fetchCredits = async () => {
                const creditsData = await Promise.all(
                    initiatives.map(async (initiative) => {
                        const voteInfo = await getVoteInfo(
                            initiative.initiativeId,
                            address
                        );
                        if (voteInfo.votesNumber === 0) {
                            setUserVoted((prev) => ({
                                ...prev,
                                [initiative.initiativeId]: true,
                            }));
                        }
                        setVotes((prev) => ({
                            ...prev,
                            [initiative.initiativeId]: Math.sqrt(
                                voteInfo.votesNumber
                            ),
                        }));

                        setVoteTypes((prev) => ({
                            ...prev,
                            [initiative.initiativeId]: voteInfo.upvote,
                        }));
                        return {
                            [initiative.initiativeId]:
                                voteInfo.votesNumber ** 2,
                        };
                    })
                );
                setCreditsUsed(Object.assign({}, ...creditsData));
            };
            fetchCredits();
        }
    }, [address, initiatives]);

    const handleVote = (initiativeId: string, isIncrease: boolean) => {
        setVotes((prevVotes) => {
            const currentVotes = prevVotes[initiativeId] || 0;
            let newVotes = isIncrease ? currentVotes + 1 : currentVotes - 1;
            setVoteTypes((prev) => ({
                ...prev,
                [initiativeId]:
                    newVotes > 0 ? true : newVotes === 0 ? undefined : false,
            }));

            setCreditsUsed((prevCredits) => ({
                ...prevCredits,
                [initiativeId]: newVotes ** 2,
            }));

            return { ...prevVotes, [initiativeId]: newVotes };
        });
    };

    const handleVoteSubmit = async (initiativeId: string) => {
        if (!address) {
            alert("Connect your wallet to vote!");
            return;
        }

        const voteCount = votes[initiativeId] || 0;
        if (voteCount === 0) {
            alert("Please select votes first!");
            return;
        }

        const isUpvote = voteCount > 0;

        try {
            await writeContract({
                address: contractAddress,
                abi: contractAbi,
                functionName: isUpvote ? "upvote" : "downvote",
                args: [initiativeId, Math.abs(voteCount)],
            });
            alert("Vote submitted successfully!");
            setUserVoted((prev) => ({ ...prev, [initiativeId]: true }));
        } catch (error) {
            console.error("Error submitting vote:", error);
            alert("Vote failed!");
        }
    };

    return (
        <div className="flex flex-col gap-8 items-center w-full">
            {initiatives.length > 0 ? (
                initiatives.map((initiative) => {
                    return (
                        <div
                            className="flex flex-row gap-4"
                            key={initiative.initiativeId}
                        >
                            <div className="relative flex flex-col items-center justify-between border border-gray-600 rounded-lg p-6 bg-gray-800 shadow-md w-[700px] min-h-[140px] mb-12">
                                <div className="flex flex-col justify-center flex-grow">
                                    <h3 className="text-md font-bold text-white mb-3 truncate">
                                        {initiative.title}
                                    </h3>
                                    <p className="text-sm text-gray-400">
                                        {initiative.description}
                                    </p>
                                </div>
                                <div className="absolute bottom-[-40px] left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-sm font-bold px-4 py-2 rounded-md shadow-md border border-gray-600">
                                    {voteTypes[initiative.initiativeId] !==
                                    undefined ? (
                                        voteTypes[initiative.initiativeId] ===
                                        true ? (
                                            <ThumbsUp className="w-6 h-6" />
                                        ) : (
                                            <ThumbsDown className="w-6 h-6" />
                                        )
                                    ) : undefined}
                                    Credits Used :{" "}
                                    {creditsUsed[initiative.initiativeId] ?? 0}
                                </div>
                            </div>
                            <div className="flex flex-col">
                                {userVoted[initiative.initiativeId] ? (
                                    <div className="flex flex-row items-center gap-4 bg-gray-900 p-4 rounded-lg shadow-md min-w-[180px] border border-gray-700">
                                        <div className="flex flex-col gap-4">
                                            <button
                                                className="bg-gray-700 text-white p-2 rounded-full shadow-md hover:bg-green-500"
                                                onClick={() =>
                                                    handleVote(
                                                        initiative.initiativeId,
                                                        true
                                                    )
                                                }
                                            >
                                                <ThumbsUp className="w-6 h-6" />
                                            </button>
                                            <button
                                                className="bg-gray-700 text-white p-2 rounded-full shadow-md hover:bg-red-500"
                                                onClick={() =>
                                                    handleVote(
                                                        initiative.initiativeId,
                                                        false
                                                    )
                                                }
                                            >
                                                <ThumbsDown className="w-6 h-6" />
                                            </button>
                                        </div>
                                        <button
                                            className={`px-4 py-2 rounded-lg shadow-md text-white ${
                                                creditsUsed[
                                                    initiative.initiativeId
                                                ] === 0
                                                    ? "bg-gray-500 cursor-not-allowed"
                                                    : "bg-blue-500 hover:bg-blue-600"
                                            }`}
                                            disabled={
                                                creditsUsed[
                                                    initiative.initiativeId
                                                ] === 0
                                            }
                                            onClick={() =>
                                                handleVoteSubmit(
                                                    initiative.initiativeId
                                                )
                                            }
                                        >
                                            Vote
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-row items-center gap-4 bg-gray-900 p-4 rounded-lg shadow-md min-w-[180px] border border-gray-700">
                                        <div className="flex flex-col gap-4">
                                            Already Voted
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })
            ) : (
                <p className="text-gray-400">No initiatives found.</p>
            )}
        </div>
    );
}

export default function Governance() {
    return (
        <div className="flex flex-col w-full h-[calc(100dvh)] p-4">
            <div className="flex-1 overflow-y-auto">
                <PageHeader title="Governance" />
                <div className="grid grid-cols-[3fr_1fr] gap-6 items-start">
                    <div className="flex flex-col items-center justify-center border border-gray-700 rounded-lg p-6 min-h-[400px] bg-gray-800 w-full">
                        <h2 className="text-xl font-bold text-white mb-8">
                            Initiatives
                        </h2>
                        <Suspense
                            fallback={
                                <p className="text-gray-400">
                                    Loading initiatives...
                                </p>
                            }
                        >
                            <InitiativesList dataPromise={getInitiatives()} />
                        </Suspense>
                    </div>
                    <div className="flex flex-col items-center gap-4 p-4 border border-gray-700 rounded-lg w-[200px] min-h-[140px] shadow-md bg-gray-900">
                        <h2 className="text-md font-semibold text-white">
                            Your Credit
                        </h2>
                        <div className="w-full h-[40px] flex items-center justify-center bg-gray-700 text-white font-bold rounded-md border border-gray-600">
                            {100}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
