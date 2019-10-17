const path = require("path");

const HDWalletProvider = require('truffle-hdwallet-provider');
const mnemonic = "receive risk draw record wheel gentle benefit broccoli cruel net present topic";
const infuraKey = "1fd5538f850d4ced8540cfd95af1aad7"

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 7545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
     },

     ropsten: {
      provider: () => {
        return new HDWalletProvider(
          mnemonic, 
          `https://ropsten.infura.io/${infuraKey}`
        );
      },  
      network_id: 3,       // Ropsten's id
      gas: 5500000,        // Ropsten has a lower block limit than mainnet
    }, 

  }

};
