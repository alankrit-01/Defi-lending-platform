const {ethers,waffle} = require("hardhat");
const hre = require("hardhat");


async function main() {
  const [myAccount] =await ethers.getSigners();
  const provider = waffle.provider;
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: ["0x459B5b5172317eaa7EAecA06bA3C779D9ec4E51c"],
  });
  const signer = await ethers.getSigner("0x459B5b5172317eaa7EAecA06bA3C779D9ec4E51c")
  const Defi = await ethers.getContractFactory("Defi");
  const defi = await Defi.deploy({value:"1000000000000000000"});
  await defi.deployed();
  console.log("Defi deployed to:", defi.address);
  // await signer.sendTransaction({
  //   to: "0x54Ac8c62D35c3c028adBD9B246f9df96bf0bF92b",
  //   value: ethers.utils.parseEther("1"),
  // }); 
  const Dai = await ethers.getContractAt("Dai","0x6B175474E89094C44Da98b954EedeAC495271d0F");
  await Dai.connect(signer).transfer(myAccount.address,"1063000000000000000000")
  await Dai.connect(signer).transfer(defi.address,"1000000000000000000000")

  //----------------- LENDING FUNCTIONS ---------------

  // STEP I LENDER DEPOSIT SOME ETHERS

  await defi.depositEthersLender({value :"10000000000000000000"}) //10 Ethers
  console.log((await defi.lenderInfo(myAccount.address)).amount) 

  // STEP II LENDER CAN WITHDRAW PARTIALLY

  await defi.withdrawEtherLender("1000000000000000000") //1 Ethers
  console.log((await defi.lenderInfo(myAccount.address)).amount) 
  
  // // STEP III ANYONE CAN VIEW THE PENDING INTEREST FOR A LENDER

  console.log(await defi.viewPendingInterestLender(myAccount.address))
  
  // // STEP IV  LENDER CAN WITHDRAW ALL ETHERS
  
  await defi.withdrawEtherLenderAll() 
  console.log((await defi.lenderInfo(myAccount.address)).amount) 

  // ------------------BOROWING FUNCTIONS ---------------

   // STEP I BORROWER CAN BORROW ETHER BY SENDING DAI AS COLLATERAL 

   await Dai.approve( defi.address,"1063000000000000000000");

   // STEP II BORROWER CALL DEPOSIT COLLATERAL
 
   await defi.DepositCollateral("1063000000000000000000");

   // STEP III BORROWER CAN NOT TAKE OUT LOAN (60% OF HIS COLLATERAL)
 
   await defi.takeloan();

   // STEP IV  BORROWER CAN VIEW HOW MUCH LOAN + INTEREST HE HAS TO PAY BACK
   
   console.log(await defi.depositorInfo(myAccount.address));
   console.log(await defi.viewPendingInterestBorrower(myAccount.address));

   // STEP IV  BORROWER WILL REPAY LOAN +INTEREST
   
   await defi.repayLoan({value:"644078594810000000"});







  // await Dai.connect(signer).transfer(myAccount.address,"1063000000000000000000")
  // await Dai.connect(signer).transfer(defi.address,"1000000000000000000000")

  // await Dai.approve( defi.address,"1063000000000000000000");
  // console.log(await Dai.allowance(myAccount.address,defi.address));

  // await defi.DepositCollateral("1063000000000000000000");
  // console.log(await defi.depositorInfo(myAccount.address));

  // console.log("MY ETHER BALANCE BEFORE" ,await provider.getBalance(myAccount.address))
  // await defi.takeloan();
  // console.log(await defi.depositorInfo(myAccount.address));
  // console.log(await defi.viewPendingInterestBorrower(myAccount.address));

  // console.log(await Dai.balanceOf(defi.address));
  // await defi.repayLoan({value:"644078594810000000"});
  // console.log(await Dai.balanceOf(defi.address));

  // console.log("MY ETHER BALANCE BEFORE", await provider.getBalance(myAccount.address))
  // await defi.depositEthersLender({value:100});
  // console.log(await defi.totalBalance());
  // console.log(await defi.depositorInfo(myAccount.address));
  // console.log(await defi.maxLoan(myAccount.address));
  
}
// p ->   598187353583020696
// I ->    35891241214981241
// p+I -> 634078594810000000
// p+I+e(extra) -> 677068000000000000000

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
