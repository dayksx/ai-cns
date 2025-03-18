import type { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/dist/src/signer-with-address";
import { ethers } from "hardhat";

import { verify } from "../scripts/VerifyContract";
import type { NetworkStateInitiatives } from "../src/types/NetworkStateInitiatives";
import type { NetworkStateInitiatives__factory } from "../src/types/factories/NetworkStateInitiatives__factory";

async function main() {
  const signers: SignerWithAddress[] = await ethers.getSigners();
  console.log("Deployer:", signers[0].address);
  const NetworkStateInitiatives = (await ethers.getContractFactory(
    "NetworkStateInitiatives",
  )) as NetworkStateInitiatives__factory;
  const networkStateInitiatives = (await NetworkStateInitiatives.connect(
    signers[0],
  ).deploy()) as NetworkStateInitiatives;
  networkStateInitiatives.waitForDeployment();
  const networkStateInitiativesAddress = await networkStateInitiatives.getAddress();
  console.log("NetworkStateInitiatives deployed to:", networkStateInitiativesAddress);
  setTimeout(async () => {
    await verify(networkStateInitiativesAddress);
  }, 5000);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
