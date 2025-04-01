import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { getCNSValues } from "../lib/cns/get-cns-values";
import { useAccount, useSignMessage, useWriteContract } from "wagmi";
import { PageHeader } from "../components/page-header";
import { Input } from "../components/ui/input";
import { cn } from "../lib/utils";
import { NetworkAgreementAbi } from "../abi/NetworkAgreement.abi";
import { keccak256, parseEther, stringToBytes, toHex } from "viem";
import DownloadButton from "../components/download-button";
import { constitutionTextAsMarkdown } from "../cns-constitution";
import { checkIsNetizen } from "../lib/cns/get-cns-netizens";
import { getTokenBalance } from "@/lib/viem-utils";
import { getNetizenBadgeAttestations } from "@/verax/attestations-reader";
import { Link } from "react-router";

import { http, createPublicClient } from "viem";
import { lineaSepolia as chain } from "viem/chains";

import {
  Implementation,
  toMetaMaskSmartAccount,
} from "@metamask-private/delegator-core-viem";

import { createCredential, parsePublicKey } from "webauthn-p256";
import { toWebAuthnAccount } from "viem/account-abstraction";



async function createSmartAccount() {
    
    console.log("createSmartAccount");
    const transport = http();
    const client = createPublicClient({ transport, chain });
    
    // Create WebAuthn Credential
    const credential = await createCredential({ name: "Your Delegator Passkey" });
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

      return smartAccount
}

export default function PasskeyLogin() {

    const { isConnected, address } = useAccount();

    const [isNetizen, setIsNetizen] = useState(false);
    
    useEffect(() => {
        if (isConnected && address) {
            checkIsNetizen(address).then((bool) => {
                setIsNetizen(bool);
            });
        }
    });
    
    createSmartAccount();

    return (
        <div className="flex flex-col w-full h-[100dvh] p-8 text-white">
            <div className="flex-1 overflow-y-auto">
                <PageHeader title="Simple login" />
                <div className="grid px-52 gap-y-4">
                    
                </div>
            </div>
        </div>
    );
}
