import type { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/dist/src/signer-with-address";
import { ethers } from "hardhat";

import { verify } from "../scripts/VerifyContract";
import type { NetworkStateAgreement } from "../src/types/NetworkStateAgreement";
import type { NetworkStateAgreement__factory } from "../src/types/factories/NetworkStateAgreement__factory";

async function main() {
  const signers: SignerWithAddress[] = await ethers.getSigners();
  console.log("Deployer:", signers[0].address);
  const NetworkStateAgreement = (await ethers.getContractFactory(
    "NetworkStateAgreement",
  )) as NetworkStateAgreement__factory;
  const networkStateAgreement = (await NetworkStateAgreement.connect(signers[0]).deploy("")) as NetworkStateAgreement;
  networkStateAgreement.waitForDeployment();
  const networkStateAgreementAddress = await networkStateAgreement.getAddress();
  console.log("NetworkStateAgreement deployed to:", networkStateAgreementAddress);
  setTimeout(async () => {
    await verify(networkStateAgreementAddress);
  }, 10000);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
