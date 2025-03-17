import { ethers } from "hardhat";

import type { NetworkStateAgreement } from "../../../src/types/NetworkStateAgreement";
import type { NetworkStateAgreement__factory } from "../../../src/types/factories/NetworkStateAgreementn__factory";

export async function deployNetworkStateAgreementFixture() {
  const message = "IPFS hash";

  const [owner, account2] = await ethers.getSigners();

  const NetworkStateAgreement = (await ethers.getContractFactory(
    "NetworkStateAgreement",
  )) as NetworkStateAgreement__factory;
  const networkStateAgreement = (await NetworkStateAgreement.deploy(message)) as NetworkStateAgreement;
  const networkStateAgreementAddress = await networkStateAgreement.getAddress();

  return { networkStateAgreement, networkStateAgreementAddress, message, owner, account2 };
}
