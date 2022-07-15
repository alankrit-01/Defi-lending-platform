require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.0",
      },
      {
        version: "0.5.12",
      },
      {
        version: "0.6.12",
      },
      {
        version: "0.4.17",
      },
    ],
  },
  networks: {
    hardhat: {
      chainId: 31337,
      localhost: {
        url: "http://127.0.0.1:8545",
      },
      forking: {
        url: "https://eth-rinkeby.alchemyapi.io/v2/ZCXIt2280CuFKqVMuAp2L9-tDEuccVc1",
        blockNumber: 11029412,
      },
      paths: {
        artifacts: "./client/src/artifacts",
      },
    },
    rinkeby: {
      url: "https://eth-rinkeby.alchemyapi.io/v2/ZCXIt2280CuFKqVMuAp2L9-tDEuccVc1", //Infura url with projectId
      accounts: [
        "a3e8480b3dbaba4812786c7ec82c47b6a1a4bf50f22e93fa2d6ec8c99aa5d228",
      ], // add the account that will deploy the contract (private key)
      gas: 2100000,
      gasPrice: 8000000000,
    },
  },
};

// npx hardhat node --fork https://speedy-nodes-nyc.moralis.io/3b50a8f528f7397fd9f310cf/eth/mainnet
// npx hardhat run ./scripts/script.js
// 0xB67ce5EdbC95913b18a229485f7A1bc9F727A9d0 => Deployed address
