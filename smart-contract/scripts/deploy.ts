import type { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/dist/src/signer-with-address";
import { ethers } from "hardhat";

import type { HelloNetizen } from "../src/types/HelloNetizen";
import type { HelloNetizen__factory } from "../src/types/factories/HelloNetizen__factory";

async function main() {
  const signers: SignerWithAddress[] = await ethers.getSigners();

  const HelloNetizen = (await ethers.getContractFactory("HelloNetizen")) as HelloNetizen__factory;
  const helloNetizen = (await HelloNetizen.connect(signers[0]).deploy("hello Netizen !!")) as HelloNetizen;
  helloNetizen.waitForDeployment();
  const helloNetizenAddress = await helloNetizen.getAddress();
  console.log("Greeter deployed to:", helloNetizenAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
