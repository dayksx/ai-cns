import type { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/dist/src/signer-with-address";
import { ethers } from "hardhat";

import type { CNSToken } from "../src/types/CNSToken";
import type { CNSToken__factory } from "../src/types/factories/CNSToken__factory";
import { verify } from "./VerifyContract";

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

async function main() {
  const [deployer] = await ethers.getSigners();
  await deployCNSToken(deployer, true);
}

export async function deployCNSToken(deployer: SignerWithAddress, verifyContract: boolean): Promise<string> {
  const MINTER_ADDRESS = "0x01f8e269cadcd36c945f012d2eeae814c42d1159";
  console.log("Deployer:", deployer.address);
  const factory = (await ethers.getContractFactory("CNSToken")) as CNSToken__factory;
  const contract = (await factory.connect(deployer).deploy(deployer.address, MINTER_ADDRESS)) as CNSToken;
  await contract.waitForDeployment();
  const address = await contract.getAddress();
  console.log("CNSToken deployed to:", address);

  if (verifyContract) {
    setTimeout(async () => {
      await verify(address, [deployer.address, MINTER_ADDRESS]);
    }, 10000);
  }

  return address;
}
