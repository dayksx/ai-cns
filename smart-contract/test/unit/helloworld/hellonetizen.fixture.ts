import { ethers } from "hardhat";

import type { HelloNetizen } from "../../../src/types/HelloNetizen";
import type { HelloNetizen__factory } from "../../../src/types/factories/HelloNetizen__factory";

export async function deployHelloNetizenFixture() {
  const message = "Hello Netizen !!";

  const [owner, account2] = await ethers.getSigners();

  const HelloNetizen = (await ethers.getContractFactory("HelloNetizen")) as HelloNetizen__factory;
  const helloNetizen = (await HelloNetizen.deploy(message)) as HelloNetizen;
  const helloNetizenAddress = await helloNetizen.getAddress();

  return { helloNetizen, helloNetizenAddress, message, owner, account2 };
}
