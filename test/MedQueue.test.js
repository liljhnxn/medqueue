const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("MedQueue Smart Contract", function () {
  let medQueue;
  let owner;
  let patient1;
  let patient2;
  let patient3;

  beforeEach(async function () {
    [owner, patient1, patient2, patient3] = await ethers.getSigners();
    const MedQueueFactory = await ethers.getContractFactory("MedQueue");
    medQueue = await MedQueueFactory.deploy();
    await medQueue.waitForDeployment();
  });

  it("should initialize with totalRegistrations equal to 0", async function () {
    expect(await medQueue.totalRegistrations()).to.equal(0);
  });

  it("should verify an unregistered wallet has no assigned queue number and returns 'Not registered'", async function () {
    expect(await medQueue.isRegistered(patient1.address)).to.equal(false);
    expect(await medQueue.getQueueNumber(patient1.address)).to.equal(0);
    expect(await medQueue.getRegistrationTimestamp(patient1.address)).to.equal(0);
    expect(await medQueue.getQueueStatus(patient1.address)).to.equal("Not registered");

    const info = await medQueue.getPatientQueueInfo(patient1.address);
    expect(info[0]).to.equal(false); // registered
    expect(info[1]).to.equal(0);     // queueNumber
    expect(info[2]).to.equal(0);     // timestamp
  });

  it("should assign queue number 1 to the first registering wallet", async function () {
    await medQueue.connect(patient1).registerForQueue();

    expect(await medQueue.isRegistered(patient1.address)).to.equal(true);
    expect(await medQueue.getQueueNumber(patient1.address)).to.equal(1);
    expect(await medQueue.totalRegistrations()).to.equal(1);
    expect(await medQueue.getQueueStatus(patient1.address)).to.equal("Waiting");
  });

  it("should assign queue number 2 to the second registering wallet", async function () {
    await medQueue.connect(patient1).registerForQueue();
    await medQueue.connect(patient2).registerForQueue();

    expect(await medQueue.getQueueNumber(patient1.address)).to.equal(1);
    expect(await medQueue.getQueueNumber(patient2.address)).to.equal(2);
    expect(await medQueue.totalRegistrations()).to.equal(2);
  });

  it("should prevent a wallet from registering twice", async function () {
    await medQueue.connect(patient1).registerForQueue();

    await expect(
      medQueue.connect(patient1).registerForQueue()
    ).to.be.revertedWith("Already registered");
  });

  it("should correctly store queue numbers and record registration timestamps", async function () {
    const tx = await medQueue.connect(patient1).registerForQueue();
    const receipt = await tx.wait();
    const block = await ethers.provider.getBlock(receipt.blockNumber);

    const timestamp = await medQueue.getRegistrationTimestamp(patient1.address);
    expect(timestamp).to.equal(block.timestamp);

    const info = await medQueue.getPatientQueueInfo(patient1.address);
    expect(info.registered).to.equal(true);
    expect(info.queueNumber).to.equal(1);
    expect(info.timestamp).to.equal(block.timestamp);
  });

  it("should accurately increment total registrations across multiple patients", async function () {
    expect(await medQueue.totalRegistrations()).to.equal(0);

    await medQueue.connect(patient1).registerForQueue();
    expect(await medQueue.totalRegistrations()).to.equal(1);

    await medQueue.connect(patient2).registerForQueue();
    expect(await medQueue.totalRegistrations()).to.equal(2);

    await medQueue.connect(patient3).registerForQueue();
    expect(await medQueue.totalRegistrations()).to.equal(3);
    expect(await medQueue.getQueueNumber(patient3.address)).to.equal(3);
  });

  it("should emit PatientRegistered event with correct parameters", async function () {
    const tx = await medQueue.connect(patient1).registerForQueue();
    const receipt = await tx.wait();
    const block = await ethers.provider.getBlock(receipt.blockNumber);

    await expect(tx)
      .to.emit(medQueue, "PatientRegistered")
      .withArgs(patient1.address, 1, block.timestamp);
  });
});
