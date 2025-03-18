import { ethers } from "hardhat";

import { deployNetworkStateAgreement } from "./deploy-Agreement";
import { deployNetworkStateInitiatives } from "./deploy-Initiatives";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);

  // Deploy NetworkStateAgreement
  await deployNetworkStateAgreement(deployer);

  // Deploy NetworkStateInitiatives
  await deployNetworkStateInitiatives(deployer);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
