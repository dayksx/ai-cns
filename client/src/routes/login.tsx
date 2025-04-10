import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { PageHeader } from "../components/page-header";
import { http, createPublicClient, toHex } from "viem";
import { lineaSepolia as chain } from "viem/chains";
import { Implementation, toMetaMaskSmartAccount } from "@metamask-private/delegator-core-viem";
import { createCredential } from "webauthn-p256";
import { toWebAuthnAccount } from "viem/account-abstraction";
import { checkIsNetizen } from "../lib/cns/get-cns-netizens";

async function createSmartAccount() {
    try {
        console.log("createSmartAccount");
        const transport = http();
        const client = createPublicClient({ transport, chain });
        
        // Create WebAuthn Credential
        let credential;
        try {
            credential = await createCredential({
                rp: {
                    id: window.location.hostname,
                    name: "Delegator"
                },
                user: {
                    id: new Uint8Array(32),
                    name: "Your Delegator Passkey",
                    displayName: "Your Delegator Passkey"
                },
                challenge: new Uint8Array(32),
                authenticatorSelection: {
                    userVerification: "discouraged"
                },
                attestation: "none",
                timeout: 120000
            });
            console.log("Credential created successfully:", credential);
        } catch (error) {
            console.error("Error creating WebAuthn credential:", error);
            // Log more details about the error
            if (error instanceof Error) {
                console.error("Error name:", error.name);
                console.error("Error message:", error.message);
                console.error("Error stack:", error.stack);
            }
            throw error; // Re-throw to stop execution
        }
        
        const webAuthnAccount = toWebAuthnAccount({ credential });
        const keyId = toHex("my-key-id");

        // Extract x and y Coordinates
        const publicKeyHex = webAuthnAccount.publicKey;
        const xHex = publicKeyHex.slice(2, 66); // Extract x value (32 bytes)
        const yHex = publicKeyHex.slice(66, 130); // Extract y value (32 bytes)
        const xBigInt = BigInt(`0x${xHex}`);
        const yBigInt = BigInt(`0x${yHex}`);

        const smartAccount = await toMetaMaskSmartAccount({
            client,
            implementation: Implementation.Hybrid,
            deployParams: ["0x0000000000000000000000000000000000000000", [keyId], [xBigInt], [yBigInt]],
            deploySalt: "0x",
            signatory: { webAuthnAccount, keyId },
        });

        return smartAccount;
    } catch (error) {
        console.error("Error in createSmartAccount:", error);
        return null;
    }
}

export default function PasskeyLogin() {
    const { isConnected, address } = useAccount();
    const [isNetizen, setIsNetizen] = useState(false);
    const [smartAccount, setSmartAccount] = useState<Awaited<ReturnType<typeof createSmartAccount>> | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    console.log("isNetizen", isNetizen);
    
    useEffect(() => {
        if (isConnected && address) {
            checkIsNetizen(address).then((bool) => {
                setIsNetizen(bool);
            });
        }
    }, [isConnected, address]);

    const handleCreateSmartAccount = async () => {
        if (!isConnected || !address) {
            console.log("Please connect your wallet first");
            return;
        }

        setIsLoading(true);
        try {
            const account = await createSmartAccount();
            setSmartAccount(account);
            console.log("Smart account created:", account);
        } catch (error) {
            console.error("Failed to create smart account:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col w-full h-[100dvh] p-8 text-white">
            <div className="flex-1 overflow-y-auto">
                <PageHeader title="Simple login" />
                <div className="grid px-52 gap-y-4">
                    {!isConnected && <p>Please connect your wallet first</p>}
                    {isConnected && !smartAccount && !isLoading && (
                        <button
                            onClick={handleCreateSmartAccount}
                            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition-colors"
                        >
                            Create Smart Account
                        </button>
                    )}
                    {isLoading && <p>Creating smart account...</p>}
                    {smartAccount && <p>Smart account created successfully</p>}
                </div>
            </div>
        </div>
    );
}