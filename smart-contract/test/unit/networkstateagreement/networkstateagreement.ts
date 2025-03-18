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

    this.constitutionHash = ethers.keccak256(ethers.toUtf8Bytes("A long constitution to empower decentralization"));
    this.signature = await this.signers.user1.signMessage(ethers.getBytes(this.constitutionHash));

    this.loadFixture = loadFixture;
  });

  describe("Testing", function () {
    beforeEach(async function () {
      const { networkStateAgreement, networkStateAgreementAddress, constitutionURL, owner } = await this.loadFixture(
        deployNetworkStateAgreementFixture,
      );
      this.networkStateAgreement = networkStateAgreement;
      this.networkStateAgreementAddress = networkStateAgreementAddress;
      this.constitutionURL = constitutionURL;
      this.owner = owner;
    });

    it("should return the new constitution URL once it's changed", async function () {
      expect(await this.networkStateAgreement.connect(this.signers.admin).constitutionURL()).to.equal(
        "https://ipfs.io/ipfs/xxxxxxxxxxxx",
      );
      await this.networkStateAgreement
        .connect(this.signers.admin)
        .updateConstitutionURL("https://ipfs.io/ipfs/zzzzzzzzzz");
      expect(await this.networkStateAgreement.connect(this.signers.admin).constitutionURL()).to.equal(
        "https://ipfs.io/ipfs/zzzzzzzzzz",
      );
    });

    it("should allow a user to sign the agreement", async function () {
      await this.networkStateAgreement
        .connect(this.signers.user1)
        .signAgreement("maker", "human", this.constitutionHash, this.signature);
      const userInfo = await this.networkStateAgreement.userInformation(this.signers.user1.address);
      expect(userInfo.hasAgreed).to.equal(true);
      expect(userInfo.userProfileType).to.equal("maker");
      expect(userInfo.userNatureAgent).to.equal("human");
      expect(userInfo.constitutionHash).to.equal(this.constitutionHash);
      expect(userInfo.signature).to.equal(this.signature);
    });

    it("should not allow a user to sign the agreement twice", async function () {
      await this.networkStateAgreement
        .connect(this.signers.user1)
        .signAgreement("maker", "human", this.constitutionHash, this.signature);
      await expect(
        this.networkStateAgreement
          .connect(this.signers.user1)
          .signAgreement("maker", "human", this.constitutionHash, this.signature),
      ).to.be.revertedWith("Agreement already signed");
    });

    it("should not allow a user to sign without the right profile type", async function () {
      await expect(
        this.networkStateAgreement
          .connect(this.signers.user1)
          .signAgreement("king", "human", this.constitutionHash, this.signature),
      ).to.be.revertedWith("Invalid profile type");
    });

    it("should not allow a user to sign without the right nature profile", async function () {
      await expect(
        this.networkStateAgreement
          .connect(this.signers.user1)
          .signAgreement("maker", "tiger", this.constitutionHash, this.signature),
      ).to.be.revertedWith("Invalid nature agent");
    });
  });
});
