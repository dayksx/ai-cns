import type { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/dist/src/signer-with-address";
import { ethers } from "hardhat";

import { verify } from "../scripts/VerifyContract";
import type { NetworkStateInitiatives } from "../src/types/NetworkStateInitiatives";
import type { NetworkStateInitiatives__factory } from "../src/types/factories/NetworkStateInitiatives__factory";

export async function deployNetworkStateInitiatives(
  deployer: SignerWithAddress,
  verifyContract: boolean = true,
): Promise<string> {
  const factory = (await ethers.getContractFactory("NetworkStateInitiatives")) as NetworkStateInitiatives__factory;
  const contract = (await factory.connect(deployer).deploy()) as NetworkStateInitiatives;
  await contract.waitForDeployment();
  const address = await contract.getAddress();
  console.log("NetworkStateInitiatives deployed to:", address);

  if (verifyContract) {
    setTimeout(async () => {
      await verify(address);
    }, 5000);
  }

  return address;
}
