import type { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/dist/src/signer-with-address";

import type { HelloNetizen } from "../../src/types/HelloNetizen";

type Fixture<T> = () => Promise<T>;

declare module "mocha" {
  export interface Context {
    helloNetizen: HelloNetizen;
    loadFixture: <T>(fixture: Fixture<T>) => Promise<T>;
    signers: Signers;
  }
}

export interface Signers {
  admin: SignerWithAddress;
}
