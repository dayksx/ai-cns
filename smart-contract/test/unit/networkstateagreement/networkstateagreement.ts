import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

import type { Signers } from "../../common/types";
import { deployNetworkStateAgreementFixture } from "./networkstateagreement.fixture";

describe("NetworkStateAgreement", function () {
  before(async function () {
    this.signers = {} as Signers;

    const signers = await ethers.getSigners();
    this.signers.admin = signers[0];

    this.loadFixture = loadFixture;
  });

  describe("Testing", function () {
    beforeEach(async function () {
      const { networkStateAgreement, networkStateAgreementAddress, message, owner, account2 } = await this.loadFixture(
        deployNetworkStateAgreementFixture,
      );
      this.networkStateAgreement = networkStateAgreement;
      this.networkStateAgreementAddress = networkStateAgreementAddress;
      this.message = message;
      this.owner = owner;
      this.account2 = account2;
    });

    it("should return the new IPFS hash once it's changed", async function () {
      expect(await this.networkStateAgreement.connect(this.signers.admin).constitutionHash()).to.equal("IPFS hash");

      await this.networkStateAgreement.updateConstitution("new IPFS hash");
      expect(await this.networkStateAgreement.connect(this.signers.admin).constitutionHash()).to.equal("new IPFS hash");
    });
  });
});
