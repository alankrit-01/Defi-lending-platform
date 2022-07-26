const { expect } = require("chai");

const { ethers, waffle } = require("hardhat");

describe("Lending", function () {
    let myAccount
    const provider =waffle.provider;
    let defi,dai; 

    beforeEach(async () => {
        [myAccount] =await ethers.getSigners();
        const Defi = await ethers.getContractFactory("Defi");
        defi = await Defi.deploy({value:"100000"});
        await defi.deployed();
        // console.log("Defi deployed to:", defi.address);
        // defi = await ethers.getContractAt("Defi","0x3c9D85518f1a52C5d897D051741e3a40C1d10dfd");
        // dai = await ethers.getContractAt("Dai","0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa");
    });
    it("Contract balance should be correct", async function () {
        const defiBalance =await provider.getBalance(defi.address)
        // const daiBalance =await dai.balanceOf(defi.address)
        expect(defiBalance).to.equal("100000");
        // expect(daiBalance).to.equal("1077949377202721505");
    });
    it("Lender deposit some ethers", async function () {
        await defi.depositEthersLender({value :"100"}) ;
        const currenBlock =await defi.getBlockNum();
        const lender =await defi.lenderInfo(myAccount.address);
        expect(lender.amount).to.equal("100");
        expect(lender.accInterest).to.equal("0");
        expect(lender.blockNumberLast).to.equal(currenBlock);
    });
});