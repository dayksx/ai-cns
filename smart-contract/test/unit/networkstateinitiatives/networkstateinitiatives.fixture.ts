import { ethers } from "hardhat";

import type { NetworkStateInitiatives } from "../../../src/types/NetworkStateInitiatives";
import type { NetworkStateInitiatives__factory } from "../../../src/types/factories/NetworkStateInitiatives__factory";

export async function deployNetworkStateInitiativesFixture() {
  const [owner, user1] = await ethers.getSigners();

  const NetworkStateInitiatives = (await ethers.getContractFactory(
    "NetworkStateInitiatives",
  )) as NetworkStateInitiatives__factory;
  const networkStateInitiatives = (await NetworkStateInitiatives.deploy()) as NetworkStateInitiatives;
  const networkStateInitiativesAddress = await networkStateInitiatives.getAddress();

  return { networkStateInitiatives, networkStateInitiativesAddress, owner, user1 };
}
