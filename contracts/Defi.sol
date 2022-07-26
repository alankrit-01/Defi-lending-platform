//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
// import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./libraries/SafeERC20.sol";
import "./Interface/IUniswapV2Router01.sol";
import "./Interface/IUniswapV2Router02.sol";
import "hardhat/console.sol";

interface Daitoken {
    function transferFrom(address src, address dst, uint value) external returns(bool);
    function balanceOf(address user) external returns(uint);
    function name() external returns(string memory);
    function approve(address usr, uint wad) external returns (bool);
    function transfer(address dst, uint wad) external returns (bool);
}

contract Defi {
    
    // AggregatorV3Interface internal priceFeed;
    using SafeERC20 for IERC20;
    address public uniRouterAddress =0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
    address[] public daiToWethPath =[0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa,0xc778417E063141139Fce010982780140Aa0cD5Ab];
    address[] public wethToDaiPath =[0xc778417E063141139Fce010982780140Aa0cD5Ab,0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa];
    uint256 public lendingInterestRatePerBlock = 1; // Fixed lending interest rate per block
    uint256 public borrowingInterestRatePerBlock = 2;  // Fixed borrowing interest rate per block
    uint256 public collateralFactor =60;  // How much percent of the asset can be used as collateral (overcollateralized loan) 
    Daitoken public daitoken;
    fallback() external payable{}
    receive() external payable{}
    struct lender{
        uint amount;
        uint accInterest;
        uint blockNumberLast;
    }
    struct depositor{
        uint collateralProvided;
        bool loanTaken;
        uint loanInEth;
        uint blockNumberLast;
    }
    mapping(address =>lender) public lenderInfo; 
    mapping(address =>depositor) public depositorInfo;
    event data(uint _data);
    constructor() payable {
        daitoken= Daitoken(0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa);
        // priceFeed = AggregatorV3Interface(0x773616E4d11A78F511299002da57A0a94577F1f4); // ETH-DAI
    }
    // function getLatestPrice() public view returns (int) {
        // (,int price,,,) = priceFeed.latestRoundData();
        // return (price*int(depositorInfo[msg.sender].collateralProvided*collateralFactor)/100);
    // }

    // LENDER FUNCTIONS

    function viewPendingInterestLender(address _lender) public view returns(uint256 accInterest){ 
        uint blocknumber=block.number;
        uint accInterestRateTotal= lendingInterestRatePerBlock*(blocknumber-lenderInfo[_lender].blockNumberLast);
        accInterest =(lenderInfo[_lender].amount *accInterestRateTotal)/(10000);
    } 

    function depositEthersLender() public payable {
        require(msg.value>=10000,"PLEASE CALL THIS FUNCTION WITH ATLEAST 10000 WEI");
        uint blocknumber=block.number;
        if(lenderInfo[msg.sender].blockNumberLast==0 || lenderInfo[msg.sender].blockNumberLast ==blocknumber){
            lenderInfo[msg.sender].amount +=msg.value;
            lenderInfo[msg.sender].blockNumberLast=blocknumber;
            return;
        }
        uint accInterest =viewPendingInterestLender(msg.sender);
        lenderInfo[msg.sender].amount +=msg.value;
        lenderInfo[msg.sender].accInterest +=accInterest;
        lenderInfo[msg.sender].blockNumberLast=blocknumber;
        return;
    }

    function withdrawEtherLender(uint _amount) public {
        require(_amount <lenderInfo[msg.sender].amount,"CAN NOT WITHDRAW MORE THAN YOU DEPOSITED");
        uint blocknumber=block.number;
        (bool success, ) =(msg.sender).call{value: _amount}("");
        require(success,"CALL FAILED");
        if(lenderInfo[msg.sender].blockNumberLast ==blocknumber){
            lenderInfo[msg.sender].amount -=_amount;
            return;
        }
        uint accInterest =viewPendingInterestLender(msg.sender);
        lenderInfo[msg.sender].amount -=_amount;
        lenderInfo[msg.sender].accInterest +=accInterest;
        lenderInfo[msg.sender].blockNumberLast=blocknumber;
        return;
    }
 
    function withdrawEtherLenderAll() public returns(uint){
        uint accInterest =viewPendingInterestLender(msg.sender);
        lenderInfo[msg.sender].accInterest+=accInterest;
        uint totalAmount =lenderInfo[msg.sender].amount +lenderInfo[msg.sender].accInterest;
        require(totalAmount>0);
        require(totalBalance() >=totalAmount,"CAN NOT WITHDRAW MORE THAN THIS CONTRACT HAS");
        (bool success, ) =(msg.sender).call{value: totalAmount}("");
        require(success,"CALL FAILED");
        lenderInfo[msg.sender].amount =0;
        lenderInfo[msg.sender].accInterest =0;
        lenderInfo[msg.sender].blockNumberLast=0;
        return totalAmount;
    }

    // BORROWER FUNCTIONS

    function viewPendingInterestBorrower(address _borrower) public view returns(uint256 accInterest){
        require(depositorInfo[_borrower].blockNumberLast>0,"NO LOAN TAKEN");
        uint blocknumber=block.number;
        uint accInterestRateTotal= borrowingInterestRatePerBlock*(blocknumber-depositorInfo[_borrower].blockNumberLast);
        // uint accInterestRateTotal= borrowingInterestRatePerBlock*3;
        uint value =depositorInfo[msg.sender].loanInEth;
        accInterest =(value *accInterestRateTotal)/(10000);
        return accInterest;
    }    

    // depositor can only use DAI as collateral for now
    function DepositCollateral(uint _amount) public{    
        require(_amount>=10000,"MINIMUM COLLATERAL 10000");
        daitoken.transferFrom(msg.sender,address(this), _amount);  // before calling collateral, user approve
        // uint256[] memory amounts = IUniswapV2Router02(uniRouterAddress).getAmountsOut(_amount, daiToEthPath);
        // uint256 amountOutmin = amounts[amounts.length-1];
        // daitoken.approve(uniRouterAddress, _amount);
        // IUniswapV2Router02(uniRouterAddress)
        //     .swapExactTokensForTokens(
        //     _amount,
        //     0,      
        //     daiToUSDTPath,
        //     address(this),
        //     (block.timestamp +600)
        // );              
        depositorInfo[msg.sender].collateralProvided +=_amount;
        return;             
    }                   

    function maxLoan(address _user) public view returns(uint){
        uint value =(depositorInfo[_user].collateralProvided*collateralFactor)/100;
        return value;
    }   

    function takeloan() public returns(uint){
        require(depositorInfo[msg.sender].loanTaken ==false,"YOU CAN NOT TAKE MORE LOAN");
        uint _value =maxLoan(msg.sender);
        require(_value>0, "VALUE < 0" );
        daitoken.approve(uniRouterAddress, _value);
        uint userETHBalanceBefore =(msg.sender).balance;
        IUniswapV2Router02(uniRouterAddress)
            .swapExactTokensForETH(
            _value,
            0,      
            daiToWethPath,
            msg.sender,
            (block.timestamp +600)
        ); 
        uint userETHBalanceAfter =(msg.sender).balance;

        depositorInfo[msg.sender].loanTaken =true;
        depositorInfo[msg.sender].blockNumberLast=block.number;
        depositorInfo[msg.sender].loanInEth=(userETHBalanceAfter-userETHBalanceBefore);
        return _value;   
    }
    function repayLoan() public payable {
        uint amount =viewPendingInterestBorrower(msg.sender);
        uint loanInEth =depositorInfo[msg.sender].loanInEth;
        uint totalLoan =amount +loanInEth;
        require(msg.value >=totalLoan,"PLEASE PAY PRINICIPAL + INTEREST");    
        (bool success,)=uniRouterAddress.call{value: loanInEth}(abi.encodeWithSignature("swapExactETHForTokens(uint256,address[],address,uint256)",0,wethToDaiPath,address(this),(block.timestamp +600)));
        require(success,"FAILED TO CALL");
        daitoken.transfer(msg.sender,depositorInfo[msg.sender].collateralProvided); 
        depositorInfo[msg.sender].collateralProvided =0;
        depositorInfo[msg.sender].loanTaken =false;
        depositorInfo[msg.sender].blockNumberLast=0;
        depositorInfo[msg.sender].loanInEth=0;
    }

    function totalBalance() public view returns(uint){
        return address(this).balance;
    }

    function getBlockNum() public view returns(uint){
        return block.number;
    }
}
