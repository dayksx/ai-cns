import { useEffect, useState, createContext, useContext } from "react";
import { useAccount } from "wagmi";
import { PageHeader } from "../components/page-header";
import { http, createPublicClient, toHex } from "viem";
import { lineaSepolia as chain } from "viem/chains";
import { Implementation, toMetaMaskSmartAccount } from "@metamask-private/delegator-core-viem";
import { createCredential } from "webauthn-p256";
import { toWebAuthnAccount } from "viem/account-abstraction";
import { checkIsNetizen } from "../lib/cns/get-cns-netizens";

export const SmartAccountContext = createContext<{
    smartAccount: any;
    setSmartAccount: (account: any) => void;
}>({
    smartAccount: null,
    setSmartAccount: () => {},
});

export const useSmartAccount = () => useContext(SmartAccountContext);

async function createSmartAccount() {
    console.log("createSmartAccount");
    const transport = http();
    const client = createPublicClient({ transport, chain });
    
    // Create WebAuthn Credential
    const credential = await createCredential({
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
}

export default function PasskeyLogin() {
    const { isConnected, address } = useAccount();
    const [isNetizen, setIsNetizen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const { smartAccount, setSmartAccount } = useSmartAccount();

    useEffect(() => {
        if (isConnected && address) {
            checkIsNetizen(address).then((bool) => {
                setIsNetizen(bool);
            });
        }
    }, [isConnected, address]);

    const handleCreateAccount = async () => {
        try {
            setLoading(true);
            setError("");
            const account = await createSmartAccount();
            setSmartAccount(account);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create account");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col w-full h-[100dvh] p-8 text-white">
            <div className="flex-1 overflow-y-auto">
                <PageHeader title="Simple login" />
                <div className="grid px-52 gap-y-4">
                    <button
                        onClick={handleCreateAccount}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? "Creating..." : "Create Smart Account"}
                    </button>
                    
                    {error && (
                        <div className="text-red-500">
                            Error: {error}
                        </div>
                    )}

                    {smartAccount && (
                        <div className="text-green-500">
                            Smart Account Created Successfully!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
