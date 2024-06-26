require("nomiclabs/hardhat-etherscan");

// We require the Hardhat Runtime Environment explicitly here. This is optional 
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { abi, bytecode } = require("usingtellor/artifacts/contracts/TellorPlayground.sol/TellorPlayground.json")


async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile 
  // manually to make sure everything is compiled
  // await hre.run('compile');

  var provider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_URL);
  let wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider)
  
  ////////////// TellorFlex
  console.log("Starting deployment for flex contract...")
  const EthBostonFactory = await ethers.getContractFactory("contracts/EthBoston.sol:EthBoston", wallet)
  const oracleAddress = "0xC866DB9021fe81856fF6c5B3E3514BF9D1593D81";
  const EthBoston = await EthBostonFactory.deploy(oracleAddress);
  await EthBoston.deployed();

  console.log("Verifying...");
  await hre.run("verify:verify", {
    address: EthBoston.address,
    contract: "contracts/EthBoston.sol:EthBoston", //Filename.sol:ClassName
  constructorArguments: [oracleAddress],
  });

  console.log("EthBoston deployed to:", EthBoston.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
