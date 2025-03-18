import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

import type { Signers } from "../../common/types";
import { deployNetworkStateInitiativesFixture } from "./networkstateinitiatives.fixture";

describe("NetworkStateInitiatives", function () {
  before(async function () {
    this.signers = {} as Signers;

    const signers = await ethers.getSigners();
    this.signers.admin = signers[0];
    this.signers.user1 = signers[1];

    this.loadFixture = loadFixture;
  });

  describe("Testing", function () {
    beforeEach(async function () {
      const { networkStateInitiatives, networkStateInitiativesAddress, owner } = await this.loadFixture(
        deployNetworkStateInitiativesFixture,
      );
      this.networkStateInitiatives = networkStateInitiatives;
      this.networkStateInitiativesAddress = networkStateInitiativesAddress;
      this.owner = owner;
    });

    it("should return a created initiative", async function () {
      const tags = ["crypto", "passport", "identity"];
      await this.networkStateInitiatives
        .connect(this.signers.admin)
        .createInitiatives(
          this.signers.admin.address,
          "a crypto passport",
          "this is a zk passport",
          "digital identity",
          tags,
        );
      // Fetch the created initiative, assuming it's stored with ID 0 or the first entry.
      const initiative = await this.networkStateInitiatives.initiatives(0);
      // Verify the basic details
      expect(initiative.instigator).to.equal(this.signers.admin.address);
      expect(initiative.title).to.equal("a crypto passport");
      expect(initiative.description).to.equal("this is a zk passport");
      expect(initiative.category).to.equal("digital identity");
    });

    it("should return the correct number of votes for the initiative", async function () {
      const tags = ["crypto", "passport", "identity"];
      await this.networkStateInitiatives
        .connect(this.signers.admin)
        .createInitiatives(
          this.signers.admin.address,
          "a crypto passport",
          "this is a zk passport",
          "digital identity",
          tags,
        );

      let initiative = await this.networkStateInitiatives.initiatives(0);
      await this.networkStateInitiatives.connect(this.signers.admin).upvote(initiative.id, 50);
      await this.networkStateInitiatives.connect(this.signers.user1).downvote(initiative.id, 25);
      initiative = await this.networkStateInitiatives.initiatives(0);
      expect(initiative.upvotes).to.equal(50);
      expect(initiative.downvotes).to.equal(25);
    });
  });
});
