import type { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/dist/src/signer-with-address";
import { ethers } from "hardhat";

import { verify } from "../scripts/VerifyContract";
import type { NetworkStateAgreement } from "../src/types/NetworkStateAgreement";
import type { NetworkStateAgreement__factory } from "../src/types/factories/NetworkStateAgreement__factory";

export async function deployNetworkStateAgreement(
  deployer: SignerWithAddress,
  verifyContract: boolean = true,
): Promise<string> {
  console.log("Deployer:", deployer.address);
  const factory = (await ethers.getContractFactory("NetworkStateAgreement")) as NetworkStateAgreement__factory;
  const contract = (await factory.connect(deployer).deploy("")) as NetworkStateAgreement;
  await contract.waitForDeployment();
  const address = await contract.getAddress();
  console.log("NetworkStateAgreement deployed to:", address);

  await fillData(contract);

  if (verifyContract) {
    setTimeout(async () => {
      await verify(address, [""]);
    }, 10000);
  }

  return address;
}

async function fillData(contract: NetworkStateAgreement) {
  const [acc1, acc2, acc3] = await ethers.getSigners();
  const constitutionHash = ethers.keccak256(ethers.toUtf8Bytes("A long constitution to empower decentralization"));

  const signature = await acc1.signMessage(ethers.getBytes(constitutionHash));
  await contract.connect(acc1).signAgreement("maker", "human", constitutionHash, signature);

  const signature2 = await acc2.signMessage(ethers.getBytes(constitutionHash));
  await contract.connect(acc2).signAgreement("instigator", "AI", constitutionHash, signature2);

  const signature3 = await acc3.signMessage(ethers.getBytes(constitutionHash));
  await contract.connect(acc3).signAgreement("investor", "human", constitutionHash, signature3);
}
