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
    this.signers.user1 = signers[1];

    this.loadFixture = loadFixture;
  });

  describe("Testing", function () {
    beforeEach(async function () {
      const { networkStateAgreement, networkStateAgreementAddress, constitutionHash, owner } = await this.loadFixture(
        deployNetworkStateAgreementFixture,
      );
      this.networkStateAgreement = networkStateAgreement;
      this.networkStateAgreementAddress = networkStateAgreementAddress;
      this.constitutionHash = constitutionHash;
      this.owner = owner;
    });

    it("should return the new IPFS hash once it's changed", async function () {
      expect(await this.networkStateAgreement.connect(this.signers.admin).constitutionHash()).to.equal("IPFS hash");
      await this.networkStateAgreement.connect(this.signers.admin).updateConstitution("new IPFS hash");
      expect(await this.networkStateAgreement.connect(this.signers.admin).constitutionHash()).to.equal("new IPFS hash");
    });

    it("should allow a user to sign the agreement", async function () {
      await this.networkStateAgreement.connect(this.signers.user1).signAgreement();
      const hasSigned = await this.networkStateAgreement.hasAgreed(this.signers.user1);
      expect(hasSigned).to.equal(true);
    });

    it("should not allow a user to sign the agreement twice", async function () {
      await this.networkStateAgreement.connect(this.signers.user1).signAgreement();
      await expect(this.networkStateAgreement.connect(this.signers.user1).signAgreement()).to.be.revertedWith(
        "Agreement already signed",
      );
    });
  });
});
