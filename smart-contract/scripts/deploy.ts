import type { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/dist/src/signer-with-address";
import { ethers } from "hardhat";

import type { NetworkStateAgreement } from "../src/types/NetworkStateAgreement";
import type { NetworkStateAgreement__factory } from "../src/types/factories/NetworkStateAgreement__factory";

async function main() {
  const signers: SignerWithAddress[] = await ethers.getSigners();

  const NetworkStateAgreement = (await ethers.getContractFactory(
    "NetworkStateAgreement",
  )) as NetworkStateAgreement__factory;
  const networkStateAgreement = (await NetworkStateAgreement.connect(signers[0]).deploy(
    "IPFS hash",
  )) as NetworkStateAgreement;
  networkStateAgreement.waitForDeployment();
  const networkStateAgreementAddress = await networkStateAgreement.getAddress();
  console.log("NetworkStateAgreement deployed to:", networkStateAgreementAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
