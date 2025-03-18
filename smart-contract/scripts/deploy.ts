import type { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/dist/src/signer-with-address";
import { ethers } from "hardhat";

import type { NetworkStateAgreement } from "../src/types/NetworkStateAgreement";
import type { NetworkStateInitiatives } from "../src/types/NetworkStateInitiatives";
import type { NetworkStateAgreement__factory } from "../src/types/factories/NetworkStateAgreement__factory";
import type { NetworkStateInitiatives__factory } from "../src/types/factories/NetworkStateInitiatives__factory";

async function main() {
  const signers: SignerWithAddress[] = await ethers.getSigners();
  console.log("Deployer:", signers[0].address);
/*
  const NetworkStateAgreement = (await ethers.getContractFactory(
    "NetworkStateAgreement",
  )) as NetworkStateAgreement__factory;
  const networkStateAgreement = (await NetworkStateAgreement.connect(signers[0]).deploy(
    "IPFS hash",
  )) as NetworkStateAgreement;
  networkStateAgreement.waitForDeployment();
  const networkStateAgreementAddress = await networkStateAgreement.getAddress();
  console.log("NetworkStateAgreement deployed to:", networkStateAgreementAddress);
*/
  const NetworkStateInitiatives = (await ethers.getContractFactory(
    "NetworkStateInitiatives",
  )) as NetworkStateInitiatives__factory;
  const networkStateInitiatives = (await NetworkStateInitiatives.connect(
    signers[1],
  ).deploy()) as NetworkStateInitiatives;
  networkStateInitiatives.waitForDeployment();
  const networkStateInitiativesAddress = await networkStateInitiatives.getAddress();
  console.log("NetworkStateInitiatives deployed to:", networkStateInitiativesAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
