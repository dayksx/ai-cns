import type { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/dist/src/signer-with-address";
import { ethers } from "hardhat";

import { verify } from "../scripts/VerifyContract";
import type { NetworkStateAgreement } from "../src/types/NetworkStateAgreement";
import type { NetworkStateAgreement__factory } from "../src/types/factories/NetworkStateAgreement__factory";

export async function deployNetworkStateAgreement(
  deployer: SignerWithAddress,
  verifyContract: boolean = true,
): Promise<string> {
  const factory = (await ethers.getContractFactory("NetworkStateAgreement")) as NetworkStateAgreement__factory;
  const contract = (await factory.connect(deployer).deploy("")) as NetworkStateAgreement;
  await contract.waitForDeployment();
  const address = await contract.getAddress();
  console.log("NetworkStateAgreement deployed to:", address);

  if (verifyContract) {
    setTimeout(async () => {
      await verify(address);
    }, 5000);
  }

  return address;
}
