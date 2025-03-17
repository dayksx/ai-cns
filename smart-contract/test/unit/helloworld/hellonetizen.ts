import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

import type { Signers } from "../../common/types";
import { deployHelloNetizenFixture } from "./hellonetizen.fixture";

describe("HelloNetizen", function () {
  before(async function () {
    this.signers = {} as Signers;

    const signers = await ethers.getSigners();
    this.signers.admin = signers[0];

    this.loadFixture = loadFixture;
  });

  describe("Testing", function () {
    beforeEach(async function () {
      const { helloNetizen, helloNetizenAddress, message, owner, account2 } =
        await this.loadFixture(deployHelloNetizenFixture);
      this.helloNetizen = helloNetizen;
      this.helloNetizenAddress = helloNetizenAddress;
      this.message = message;
      this.owner = owner;
      this.account2 = account2;
    });

    it("should return the new message once it's changed", async function () {
      expect(await this.helloNetizen.connect(this.signers.admin).say()).to.equal("Hello Netizen !!");

      await this.helloNetizen.setHello("Hello new Netizen!");
      expect(await this.helloNetizen.connect(this.signers.admin).say()).to.equal("Hello new Netizen!");
    });
  });
});
