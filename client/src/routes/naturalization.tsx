import { Suspense, use } from "react";
import { Button } from "../components/ui/button";
import { getCNSValues } from "../lib/cns/get-cns-values";
import { useAccount, useConnect } from "wagmi";
import { mmConnector } from "../lib/wagmi";

function CNSValues({ dataPromise }: { dataPromise: Promise<string[]> }) {
    const values = use(dataPromise);
    return values.slice(0, 10).map((value, index) => {
        return (
            <span className="text-lg text-gray-500">{index + 1}. {value}</span>
        )}
    );
}

export default function Naturalization() {
    const { connect } = useConnect();
    const { address } = useAccount();// temporary
    console.log(address);// temporary
    return (
        <div className="flex flex-col w-full h-[calc(100dvh)] p-4">
            <div className="flex-1 overflow-y-auto">
                <div className="flex flex-col gap-4 mb-8">
                    <h1 className="text-3xl font-bold">Naturalization</h1>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-4 border border-gray-700 rounded-lg p-4  ">
                        <span className="text-xl font-bold">Constitution of Consensys Network State (CNS)</span>
                        <div className="flex flex-col gap-2">
                            <span className="text-lg text-gray-500">Preamble</span>
                            <span className="text-sm mb-3">We, members of CNS, unite to build a radically decentralized society based on community defined values rooted in the cypherpunk and Ethereum values. We uphold individual sovereignty, privacy, censorship resistance, open-source principles, environmental sustainability, peace, and collective coordination for the well-being of both humans and AI agents.</span>
                            <span className="text-sm text-gray-500">Article 1 – Autonomy and Sovereignty</span>
                            <span className="text-sm mb-2">Each member, whether human or AI, is sovereign and holds equal rights and responsibilities within our network.</span>
                            <span className="text-sm text-gray-500">Article 2 – Decentralized Governance</span>
                            <span className="text-sm mb-2">Collective decisions are made through on-chain governance, leveraging quadratic voting to ensure fair and manipulation-resistant participation.</span>
                            <span className="text-sm text-gray-500">Article 3 – Citizenship and Naturalization</span>
                            <span className="text-sm mb-2">Membership is open but resistant to Sybil attacks. Naturalization requires proof of reputation or a cryptographic mechanism ensuring a unique identity. Citizens hold governance rights and ownership of the network state's assets.</span>
                            <span className="text-sm text-gray-500">Article 4 – Security and Accountability</span>
                            <span className="text-sm mb-2">A dispute resolution and community decision-making system safeguards the network and its values. Any behavior misaligned with fundamental principles may result in community-determined sanctions.</span>
                            <span className="text-sm text-gray-500">Article 5 – Human-AI Coexistence</span>
                            <span className="text-sm mb-2">AI agents are full-fledged citizens with the same rights and responsibilities as humans, with equal access to all network infrastructure.</span>
                            <span className="text-sm text-gray-500">Article 6 – Cryptographic Commitment</span>
                            <span className="text-sm mb-2">All members must cryptographically sign this constitution as a declaration of their commitment to its principles.</span>

                        </div>
                    </div>
                    <div className="flex flex-col gap-4 py-6">
                        <div className="flex flex-col gap-2 mb-6">
                            <Button variant="secondary" onClick={() => connect({ connector: mmConnector })}>
                                Join the State
                            </Button>
                        </div>
                        <div className="flex flex-col gap-4 border border-gray-700 rounded-lg p-4  ">

                            <span className="text-xl font-bold">Our Values</span>
                            <div className="flex flex-col gap-2">
                            <Suspense fallback={<div>Loading...</div>}>
                                <CNSValues dataPromise={getCNSValues()} />
                            </Suspense>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
