import React, { Component } from 'react';
import './App.css';
import logo from './logo.svg';
import Web3 from 'web3'
import Contract from './abis/Greeter.json'

import 'bootstrap/dist/css/bootstrap.css'

const EthereumTx = require('ethereumjs-tx').Transaction


class App extends Component {
  componentWillMount() {
    this.loadBlockchainData()
  }
  
  async loadBlockchainData() {
    const web3 = new Web3('http://127.0.0.1:7545')
    const network = await web3.eth.net.getNetworkType()
    const networkId = await web3.eth.net.getId()
    // const accounts = await web3.eth.getAccounts()
    // const contract = await web3.eth.Contract(Contract.abi, Contract.networks[networkId].address)
    // const createAccount = await web3.eth.accounts.create('crisp poverty quote donkey oppose soap cost lonely find tonight lawn august danger accident dream inherit rent weasel torch strike fix hungry inject country')
    // console.log(createAccount)
    
    // const infura = 'https://ropsten.infura.io/v3/d73c9765aa7f4d2592fa50d1d87008a1';
    // const web3 = new Web3(new Web3.providers.HttpProvider(infura));

    // const createAccount = await web3.eth.accounts.create('crisp poverty quote donkey oppose soap cost lonely find tonight lawn august danger accident dream inherit rent weasel torch strike fix hungry inject country')
    // console.log(createAccount)

    const createAccount = web3.eth.accounts.privateKeyToAccount('0x393dde1fd9daebe7b4dd43f1ef2044ed80ef3a5c6295fbe055c91432cfbb7c83');
    console.log(createAccount)

    web3.eth.defaultAccount = createAccount.address;
    //var pk  = createAccount.privateKey;  // private key of your account
    console.log(createAccount.privateKey.slice(2))
    const pk = Buffer.from(
      createAccount.privateKey.slice(2),
      'hex',
    )
    console.log(pk)
    //var toadd = process.env.WALLET_DESTINATION;
    var address = Contract.networks[networkId].address; //Contract Address

    const nonce = await web3.eth.getTransactionCount(web3.eth.defaultAccount, function (err, nonce) {
      console.log("nonce value is", nonce)
    })

    const contract = new web3.eth.Contract(Contract.abi, address)

    const greet = await contract.methods.greet().call()
    this.setState({ greet })

  
    this.setState({ 
      web3: web3,
      account: createAccount.address,
      address: address,
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

    console.log(this.state.text)
    const functionAbi = await this.state.contract.methods.setGreeting(this.state.text).encodeABI()
    console.log(this.state.nonce)
    var details = await {
      nonce : this.state.nonce,
      gasPrice : 0,
      gas : 0,
      gasLimit: 0,
      from : this.state.web3.eth.coinbase,
      to: this.state.address,
      value : 0,
      data : functionAbi,
    };

    const transaction = await new EthereumTx(details, {'chain':'ropsten'});
    console.log(transaction)
    console.log(this.state.pk)
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

    console.log(1)

    //const greet = await this.state.contract.methods.setGreeting(this.state.text).send({ from: this.state.account })
    //console.log(greet)
    
    // this.setState({ loading: true })
    // await this.props.login(this.state.mnemonic)
    // this.setState({ loading: false })
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
