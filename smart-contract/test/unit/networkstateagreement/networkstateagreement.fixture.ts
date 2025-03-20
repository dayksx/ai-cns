import { ethers } from "hardhat";

import type { NetworkStateAgreement } from "../../../src/types/NetworkStateAgreement";
import type { NetworkStateAgreement__factory } from "../../../src/types/factories/NetworkStateAgreement__factory";

export async function deployNetworkStateAgreementFixture() {
  const constitutionURL = "https://ipfs.io/ipfs/xxxxxxxxxxxx";

  const [owner, user1] = await ethers.getSigners();

  const NetworkStateAgreement = (await ethers.getContractFactory(
    "NetworkStateAgreement",
  )) as NetworkStateAgreement__factory;
  const networkStateAgreement = (await NetworkStateAgreement.deploy(constitutionURL)) as NetworkStateAgreement;
  const networkStateAgreementAddress = await networkStateAgreement.getAddress();

  return { networkStateAgreement, networkStateAgreementAddress, constitutionURL, owner, user1 };
}
