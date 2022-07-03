const {ethers, waffle} = require("hardhat");
async function main() {
  const [account] =await ethers.getSigners();
  const provider = waffle.provider;
  
  const Defi =await ethers.getContractFactory("Defi");
  const defi =Defi.attach("0x9Fc07E770b3cC92F7C75bB578AB1A68b95ea0bdF");
  const Dai = await ethers.getContractAt("Dai", "0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa");

  // console.log("MY DAI BALANCE :", await Dai.balanceOf(account.address));
  console.log("DEFT BALANCE :", (await defi.getLatestPrice()).toNumber());
  // 1059.12713035
  // console.log((await(await defi.getB(account.address)).wait()).events[0].args);
  // console.log((await(await defi.getB(defi.address)).wait()).events[0].args);
  // console.log((await(await defi.DepositCollateral("11490391")).wait()).events[1].args);
  
  // await Dai.approve("0x6ed9f2DDDbA94CCBfD7902d5e90E282d1610ec57","11490391");
  // console.log(await Dai.allowance(account.address,"0x6ed9f2DDDbA94CCBfD7902d5e90E282d1610ec57"));
  // console.log(await Dai.allowance("0x6ed9f2DDDbA94CCBfD7902d5e90E282d1610ec57","0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"));
  // console.log(await defi.totalBalance());
  // console.log(await defi.getBlockNum());
  // console.log(await defi.viewPendingInterestLender(account.address));
  // console.log(await provider.getBalance(account.address))
  // console.log(await defi.lenderInfo(account.address));
  // await defi.DepositCollateral("11490391");
    // gasLimit: 10000000,);
    // console.log(defi.address);
  // console.log(await defi.depositorInfo(account.address));
} 
 
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
