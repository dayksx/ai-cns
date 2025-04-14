import { useState } from "react";
import { PageHeader } from "../components/page-header";
import { http, parseEther } from "viem";
import { createPimlicoClient } from "permissionless/clients/pimlico";
import { useSmartAccount } from "./login";

export default function UserOp() {
    const [txHash, setTxHash] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const { smartAccount } = useSmartAccount();

    async function sendUserOp() {
        try {
            if (!smartAccount) {
                throw new Error("Please create a smart account first");
            }

            setLoading(true);
            setError("");
            
            const pimlicoClient = createPimlicoClient({
                transport: http(process.env.BUNDLER_URL),
            });

            const { fast: fee } = await pimlicoClient.getUserOperationGasPrice();

            const userOperationHash = await pimlicoClient.sendUserOperation({
                account: smartAccount,
                calls: [
                    {
                        to: "0x1234567890123456789012345678901234567890",
                        value: parseEther("0.001")
                    }
                ],
                ...fee
            });

            const { receipt } = await pimlicoClient.waitForUserOperationReceipt({
                hash: userOperationHash
            });

            setTxHash(receipt.transactionHash);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col w-full h-[100dvh] p-8 text-white">
            <div className="flex-1 overflow-y-auto">
                <PageHeader title="Test User Operation" />
                <div className="grid px-52 gap-y-4">
                    <button
                        onClick={sendUserOp}
                        disabled={loading || !smartAccount}
                        className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? "Sending..." : "Send User Operation"}
                    </button>
                    
                    {error && (
                        <div className="text-red-500">
                            Error: {error}
                        </div>
                    )}

                    {txHash && (
                        <div className="text-green-500">
                            Transaction Hash: {txHash}
                        </div>
                    )}

                    {!smartAccount && (
                        <div className="text-yellow-500">
                            Please create a smart account in the login page first
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 