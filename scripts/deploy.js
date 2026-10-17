const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  if (!deployer) {
    throw new Error(
      "No deployer account found! Please configure PRIVATE_KEY in your .env or .env.local file."
    );
  }

  const networkName = hre.network.name;
  const chainId = (await hre.ethers.provider.getNetwork()).chainId;

  console.log("=================================================");
  console.log(" MedQueue Deployment");
  console.log("=================================================");
  console.log(`Network: ${networkName} (Chain ID: ${chainId})`);
  console.log(`Deployer address: ${deployer.address}`);
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(`Deployer balance: ${hre.ethers.formatEther(balance)} BOT`);

  console.log("\nDeploying MedQueue contract...");
  const MedQueue = await hre.ethers.getContractFactory("MedQueue");
  const medQueue = await MedQueue.deploy();

  await medQueue.waitForDeployment();
  const contractAddress = await medQueue.getAddress();
  const deployTx = medQueue.deploymentTransaction();

  console.log("=================================================");
  console.log(" CONTRACT DEPLOYED SUCCESSFULLY!");
  console.log("=================================================");
  console.log(`Contract Address: ${contractAddress}`);
  if (deployTx) {
    console.log(`Deployment Tx Hash: ${deployTx.hash}`);
  }
  console.log(`Explorer Link: https://scan.bohr.life/address/${contractAddress}`);
  console.log("=================================================");
  console.log("\nNEXT STEPS:");
  console.log("1. Copy the contract address above.");
  console.log("2. Open your .env.local file.");
  console.log(`3. Set NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}`);
  console.log("4. Restart your Next.js dev server (npm run dev) to apply changes.");
  console.log("=================================================\n");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
