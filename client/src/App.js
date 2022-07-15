import {
  Grid,
  Typography,
  Box,
  Toolbar,
  Button,
  AppBar,
  Paper,
} from "@mui/material";
import { useEffect, useState } from "react";
import MarketPlace from "./components/MarketPlace";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import DefiJSON from "./artifacts/contracts/Defi.sol/Defi.json";
var Contract = require("web3-eth-contract");

function App() {
  const address = "0x902E689A6313c00da807B7493aa25aa6917bDC2B";
  const [balance, setBalance] = useState(null);
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
    contract: null,
    isProviderLoaded: false,
  });
  const [account, setAccount] = useState(null);
  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider();
      Contract.setProvider(provider);
      if (provider) {
        var contract = new Contract(DefiJSON.abi, address);
        setWeb3Api({
          provider,
          web3: new Web3(provider),
          isProviderLoaded: true,
          contract,
        });
      } else {
        console.log("Connect to Metamask!");
        setWeb3Api((api) => ({ ...api, isProviderLoaded: true }));
      }
    };
    loadProvider();
  }, []);

  const { web3, isProviderLoaded, contract, provider } = web3Api;

  useEffect(() => {
    const loadAccount = async () => {
      const accounts = await web3Api.web3.eth.getAccounts();
      setAccount(accounts[0]);
    };
    web3Api.web3  && loadAccount();
  }, [web3Api.web3]);

  useEffect(() => {
    const loadBalance = async () => {
      const balance = await web3Api.web3.eth.getBalance(account);
      setBalance(web3Api.web3.utils.fromWei(balance, "ether"));
    };
    account && loadBalance();
  }, [account]);

  console.log(contract)

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, fontFamily: "'Lato', sans-serif" }}
            >
              Lending Defi
            </Typography>
            {account ? (
              <h1>Welcome</h1>
            ) : (
              <Button
                onClick={() =>
                  web3Api.provider.request({ method: "eth_requestAccounts" })
                }
                color="inherit"
                sx={{ fontFamily: "'Lato', sans-serif" }}
              >
                Connect
              </Button>
            )}
          </Toolbar>
        </AppBar>
      </Box>
      <Grid container spacing={3} sx={{ marginTop: "2px" }}>
        <Grid item xs={12} md={8}>
          <MarketPlace />
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              marginRight: "2%",
              backgroundColor: "#757ce8",
              justifyItems: "center",
              height: "130px",
              position: "relative",
            }}
          >
            <Box
              sx={{ padding: "10px", display: "flex", flexDirection: "column" }}
            >
              <div>
                {" "}
                <Typography
                  align="center"
                  sx={{ color: "white", fontFamily: "'Lato', sans-serif" }}
                  variant="h6"
                >
                  Your Account
                </Typography>
              </div>
              <div>
                {" "}
                <Typography
                  align="center"
                  gutterBottom
                  sx={{
                    color: "white",
                    marginTop: "5px",
                    fontFamily: "'Lato', sans-serif",
                  }}
                  variant="h5"
                >
                  My Balance : {balance}
                </Typography>
                <Typography
                  align="center"
                  sx={{
                    color: "white",
                    position: "absolute",
                    bottom: "0px",
                    fontFamily: "'Lato', sans-serif",
                  }}
                  variant="p"
                >
                  XYZ network
                </Typography>
              </div>
            </Box>
          </Paper>
        </Grid>
        <Grid
          xs={12}
          md={12}
          sx={{
            marginTop: "3%",
            fontFamily: "'Heebo', sans-serif",
            fontWeight: "600",
            color: "#757ce8",
          }}
        >
          <Typography align="center" variant="h4">
            Summary
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              marginLeft: "2%",
              backgroundColor: "#757ce8",
              justifyItems: "center",
              height: "200px",
              position: "relative",
            }}
          >
            <Box
              sx={{ padding: "10px", display: "flex", flexDirection: "column" }}
            >
              <div>
                {" "}
                <Typography
                  align="center"
                  sx={{ color: "white", fontFamily: "'Lato', sans-serif" }}
                  variant="h6"
                >
                  Your Holding
                </Typography>
              </div>
              <div>
                <Typography
                  sx={{ color: "white", fontFamily: "'Lato', sans-serif" }}
                  variant="h6"
                >
                  Deposit Amount: 100
                </Typography>
              </div>
              <div>
                <Typography
                  sx={{ color: "white", fontFamily: "'Lato', sans-serif" }}
                  variant="h6"
                >
                  Interest Earned: 100
                </Typography>
              </div>
              <div>
                <Typography
                  sx={{ color: "white", fontFamily: "'Lato', sans-serif" }}
                  variant="h6"
                >
                  Total Amount: 100
                </Typography>
              </div>
              <Box sx={{ display: "flex", marginTop: "2%" }}>
                <Button
                  variant="contained"
                  startIcon={<ArrowUpwardIcon />}
                  sx={{ color: "white" }}
                >
                  Add Funds
                </Button>
                <Button
                  variant="contained"
                  startIcon={<ArrowDownwardIcon />}
                  sx={{ color: "white", marginLeft: "2%" }}
                >
                  Withdraw
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              marginLeft: "2%",
              backgroundColor: "#757ce8",
              justifyItems: "center",
              height: "200px",
              position: "relative",
            }}
          >
            <Box
              sx={{ padding: "10px", display: "flex", flexDirection: "column" }}
            >
              <div>
                {" "}
                <Typography
                  align="center"
                  sx={{ color: "white", fontFamily: "'Lato', sans-serif" }}
                  variant="h6"
                >
                  Borrowed Holding
                </Typography>
              </div>
              <div>
                <Typography
                  sx={{ color: "white", fontFamily: "'Lato', sans-serif" }}
                  variant="h6"
                >
                  Borrowed Amount: 100
                </Typography>
              </div>
              <div>
                <Typography
                  sx={{ color: "white", fontFamily: "'Lato', sans-serif" }}
                  variant="h6"
                >
                  Interest Amount: 100
                </Typography>
              </div>
              <div>
                <Typography
                  sx={{ color: "white", fontFamily: "'Lato', sans-serif" }}
                  variant="h6"
                >
                  Total Amount: 100
                </Typography>
              </div>
              <Box sx={{ display: "flex", marginTop: "2%" }}>
                <Button
                  variant="contained"
                  startIcon={<ArrowUpwardIcon />}
                  sx={{ color: "white" }}
                >
                  Add Funds
                </Button>
                <Button
                  variant="contained"
                  startIcon={<ArrowDownwardIcon />}
                  sx={{ color: "white", marginLeft: "2%" }}
                >
                  Withdraw
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
