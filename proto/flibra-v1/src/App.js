import React, { Component } from 'react';
import './App.css';
import logo from './logo.svg';
import Web3 from 'web3'
import Contract from './abis/Greeter.json'
import 'bootstrap/dist/css/bootstrap.css'
import Common from 'ethereumjs-common'

const EthereumTx = require('ethereumjs-tx').Transaction

class App extends Component {
  componentWillMount() {
    this.loadBlockchainData()
  }
  
  async loadBlockchainData() {
    const web3 = await new Web3(new Web3.providers.HttpProvider('http://0.0.0.0:8545')) // with metamask Web3(Web3.givenProvider || 'http://0.0.0.0:8545') 
    console.log(web3)
    const network = await web3.eth.net.getNetworkType()
    console.log(network)
    const networkId = await web3.eth.net.getId()
    console.log(networkId)
    
    // const createAccount = await web3.eth.accounts.create('')
    // console.log(createAccount)

    const createAccount = await web3.eth.accounts.privateKeyToAccount('0x393dde1fd9daebe7b4dd43f1ef2044ed80ef3a5c6295fbe055c91432cfbb7c83');
    web3.eth.defaultAccount = createAccount.address;
    const pk = Buffer.from(
      createAccount.privateKey.slice(2),
      'hex',
    )

    const nonce = await web3.eth.getTransactionCount(web3.eth.defaultAccount, function (err, nonce) {
      console.log("nonce value is", nonce)
    })

    const contract = await new web3.eth.Contract(Contract.abi, Contract.networks[networkId].address)

    const greet = await contract.methods.greet().call()
    this.setState({ greet })
  
    this.setState({ 
      web3: web3,
      account: createAccount.address, //accounts[0], 
      contractAddress: Contract.networks[networkId].address,
      contract: contract,
      pk: pk,
      nonce: nonce,
    })

  }

  constructor(props) {
    super(props);
      this.state = {

      };
    this.handleSetValue = this.handleSetValue.bind(this);
  }
  
  handleSetValue = async() => {

    // Without Metamask
    const customCommon = Common.forCustomChain(
      'mainnet',
      {
        name: 'privatechain',
        networkId: 1515,
        chainId: 1515,
      },
      'petersburg',
    )

    const functionAbi = await this.state.contract.methods.setGreeting(this.state.text).encodeABI()

    var details = await {
      nonce : this.state.nonce,
      gasPrice : 0,
      gasLimit: 500000,
      from : this.state.web3.eth.coinbase,
      to : this.state.contractAddress,
      data : functionAbi,
    };

    const transaction = await new EthereumTx(details, { common: customCommon },);

    await transaction.sign(this.state.pk)
    console.log(transaction)

    var rawdata = await '0x' + transaction.serialize().toString('hex');
    console.log(rawdata)

    await this.state.web3.eth.sendSignedTransaction(rawdata)
    .on('transactionHash', function(hash){
      console.log(['transferToStaging Trx Hash:' + hash]);
    })
    .on('receipt', function(receipt){
      console.log(['transferToStaging Receipt:', receipt]);
    })
    .on('error', console.error);

    // With metamask
    // console.log(this.state.account)
    // const greet = await this.state.contract.methods.setGreeting(this.state.text).send({ from: this.state.account })
    
  }

  render() {
    return (
      <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <input type="text" onChange={async(e) => await this.setState({ text : e.target.value })} />
        <button className="btn btn-outline-primary" onClick={this.handleSetValue}>Submit</button>
        <p>{this.state.greet}</p>
      </header>
    </div>
    );
  }
}

export default App;
