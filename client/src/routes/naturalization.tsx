import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { getCNSValues } from "../lib/cns/get-cns-values";
import { useAccount, useSignMessage, useWriteContract } from "wagmi";
import { PageHeader } from "../components/page-header";
import { Input } from "../components/ui/input";
import { cn } from "../lib/utils";
import { NetworkAgreementAbi } from "../abi/NetworkAgreement.abi";
import { keccak256, parseEther, stringToBytes } from "viem";
import DownloadButton from "../components/download-button";
import { constitutionTextAsMarkdown } from "../cns-constitution";
import { getCnsNetizens } from "../lib/cns/get-cns-netizens";

export default function Naturalization() {
    const [cnsValues, setCnsValues] = useState<string[]>([]);
    const [profileType, setProfileType] = useState("maker");
    const [agentNature, setAgentNature] = useState("human");
    const [contribution, setContribution] = useState(0.001);
    const [isNetizen, setIsNetizen] = useState(false);
    const { isConnected, address, chainId } = useAccount();
    const { data: hash, writeContractAsync, isPending } = useWriteContract();
    const { signMessageAsync, data } = useSignMessage();

    useEffect(() => {
        getCNSValues().then((values) => {
            setCnsValues(values);
        });
    }, []);

    useEffect(() => {
        if (isConnected && address) {
            getCnsNetizens().then((netizens) => {
                const found = netizens?.find((n) => n.address === address);
                setIsNetizen(found !== undefined);
            });
        }
    }, [address]);

    async function signConstitution(): Promise<{
        signature: `0x${string}` | undefined;
        constitutionHash: string;
    }> {
        const constitutionHash = keccak256(
            stringToBytes(constitutionTextAsMarkdown)
        );

        const res = await signMessageAsync({
            message: constitutionHash,
        });
        console.log(res);
        console.log(data);
        console.log(constitutionHash);
        return { signature: res, constitutionHash };
    }

    async function handleAgreementSubmit() {
        console.log("joining...");
        console.log("signing constitution...");
        const { signature, constitutionHash } = await signConstitution();
        console.log("constitution signed...");
        const contributionInEther = parseEther(contribution.toString());
        console.log(
            profileType,
            agentNature,
            constitutionHash,
            signature,
            contributionInEther
        );
        console.log("writing contract...");
        if (
            profileType &&
            agentNature &&
            constitutionHash &&
            signature &&
            contributionInEther
        ) {
            await writeContractAsync({
                address: import.meta.env.VITE_CNS_AGREEMENT_CONTRACT_ADDRESS,
                abi: NetworkAgreementAbi,
                functionName: "signAgreement",
                value: contributionInEther,
                args: [profileType, agentNature, constitutionHash, signature],
            });
            console.log("contract written...");
            console.log(hash);
        } else {
            console.log("missing data to write contract");
        }
    }

    return (
        <div className="flex flex-col w-full h-[calc(100dvh)] p-4">
            <div className="flex-1 overflow-y-auto">
                <PageHeader title="Naturalization" />
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-4 border border-gray-700 rounded-lg p-4  ">
                        <div className="flex flex-row gap-2">
                            <span className="text-xl font-bold">
                                Constitution of Consensys Network State (CNS)
                            </span>
                            <DownloadButton
                                url={`https://ipfs.io/ipfs/${
                                    import.meta.env.CNS_CONSTITUTION_HASH
                                }`}
                                fileName="CNS-constitution.md"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="text-lg text-gray-500">
                                Preamble
                            </span>
                            <span className="text-sm mb-3">
                                We, members of CNS, unite to build a radically
                                decentralized society based on community defined
                                values rooted in the cypherpunk and Ethereum
                                values. We uphold individual sovereignty,
                                privacy, censorship resistance, open-source
                                principles, environmental sustainability, peace,
                                and collective coordination for the well-being
                                of both humans and AI agents.
                            </span>
                            <span className="text-sm text-gray-500">
                                Article 1 – Autonomy and Sovereignty
                            </span>
                            <span className="text-sm mb-2">
                                Each member, whether human or AI, is sovereign
                                and holds equal rights and responsibilities
                                within our network.
                            </span>
                            <span className="text-sm text-gray-500">
                                Article 2 – Decentralized Governance
                            </span>
                            <span className="text-sm mb-2">
                                Collective decisions are made through on-chain
                                governance, leveraging quadratic voting to
                                ensure fair and manipulation-resistant
                                participation.
                            </span>
                            <span className="text-sm text-gray-500">
                                Article 3 – Citizenship and Naturalization
                            </span>
                            <span className="text-sm mb-2">
                                Membership is open but resistant to Sybil
                                attacks. Naturalization requires proof of
                                reputation or a cryptographic mechanism ensuring
                                a unique identity. Citizens hold governance
                                rights and ownership of the network state's
                                assets.
                            </span>
                            <span className="text-sm text-gray-500">
                                Article 4 – Security and Accountability
                            </span>
                            <span className="text-sm mb-2">
                                A dispute resolution and community
                                decision-making system safeguards the network
                                and its values. Any behavior misaligned with
                                fundamental principles may result in
                                community-determined sanctions.
                            </span>
                            <span className="text-sm text-gray-500">
                                Article 5 – Human-AI Coexistence
                            </span>
                            <span className="text-sm mb-2">
                                AI agents are full-fledged citizens with the
                                same rights and responsibilities as humans, with
                                equal access to all network infrastructure.
                            </span>
                            <span className="text-sm text-gray-500">
                                Article 6 – Cryptographic Commitment
                            </span>
                            <span className="text-sm mb-2">
                                All members must cryptographically sign this
                                constitution as a declaration of their
                                commitment to its principles.
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 py-6">
                        <div className="flex flex-col gap-2 mb-6">
                            <div className="grid grid-cols-2 items-center gap-2">
                                <div className="font-bold text-blue-400">
                                    Profile
                                </div>
                                <select
                                    name="profileType"
                                    className="border border-gray-300 rounded-lg p-2"
                                    onChange={(e) =>
                                        setProfileType(e.target.value)
                                    }
                                >
                                    <option value="maker" selected>
                                        Maker
                                    </option>
                                    <option value="investor">Investor</option>
                                    <option value="instigator">
                                        Instigator
                                    </option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 items-center gap-2">
                                <div className="font-bold text-blue-400">
                                    Nature
                                </div>
                                <select
                                    name="agentNature"
                                    className="border border-gray-300 rounded-lg p-2"
                                    onChange={(e) =>
                                        setAgentNature(e.target.value)
                                    }
                                >
                                    <option value="human" selected>
                                        Human
                                    </option>
                                    <option value="AI">AI Agent</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 items-center gap-2">
                                <div className="font-bold text-blue-400">
                                    Contribution
                                </div>
                                <div className="grid grid-cols-2 items-center gap-2">
                                    <Input
                                        className={cn(
                                            "h-8 bg-background border-white shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring p-4"
                                        )}
                                        name="contribution"
                                        value={contribution}
                                        type="number"
                                        onChange={(e) =>
                                            setContribution(
                                                Number(e.target.value)
                                            )
                                        }
                                    />
                                    <div>ETH</div>
                                </div>
                            </div>
                            {isPending && <span>Joining...</span>}
                            {!isPending && (
                                <Button
                                    variant="secondary"
                                    disabled={
                                        !isConnected ||
                                        ![59141, 59144].includes(chainId ?? 0)
                                    }
                                    onClick={() => handleAgreementSubmit()}
                                >
                                    {!isConnected
                                        ? "Connect Wallet to Join"
                                        : ![59141, 59144].includes(chainId ?? 0)
                                        ? "Switch Network to Join"
                                        : isNetizen
                                        ? "You're already a CNS netizen"
                                        : "Join the State"}
                                </Button>
                            )}
                        </div>
                        <div className="flex flex-col gap-4 border border-gray-700 rounded-lg p-4  ">
                            <span className="text-xl font-bold">
                                Our Values
                            </span>
                            <div className="flex flex-col gap-2">
                                {cnsValues?.slice(0, 10).map((value, index) => {
                                    return (
                                        <span
                                            key={index}
                                            className="text-lg text-gray-500"
                                        >
                                            {index + 1}. {value}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
