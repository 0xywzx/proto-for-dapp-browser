import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./utils/getWeb3";
import QRCode from "qrcode.react"
import Web3 from "web3";

import "./App.css";

class App extends Component {
  constructor(props) {
    super(props) 
    this.state= {
      web3: null, 
      accounts: null, 
      contract: null,
      storageValue: 0,
    }

    //関数を使えるようにする
    this.runExample = this.runExample.bind(this);
    this.setQurageLink = this.setQurageLink.bind(this);
    this.updateWeb3 = this.updateWeb3.bind(this);
  } 

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      let web3 = await getWeb3();
      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      // Get the contract instance.
      let networkId = await web3.eth.net.getId();
      let deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  setQurageLink = async () => {
    const { QurageLinkFactory } = require('@uniqys/qurage-link-lib')
    const canvas = document.getElementById('qrcode')
    const qurageLink = QurageLinkFactory.create({ 
      endpoint: 'https://ropsten.infura.io/v3/97b1ad183cd04205ad1a80ae4df115cc', 
      netVersion: '3'
    })
    qurageLink.linkWithQRCode(canvas, true).then((linkResult) => {
      console.log(linkResult) //=> { address: "0xb45d2c89a04387c5c39898ba74af72783c97bb0e" }
      this.setState({ account: linkResult.address })
    })
    console.log(this.state.account)
  }

  updateWeb3 = async () => {
    //let web3 = await getWeb3(); 
    let web3 = new Web3(window.ethereum.currentProvider);
    console.log("updating..")
    //let web3 = await getWeb3(); 
    //let web3 = this.state.web3
    console.log(web3)
    //web3 = await new Web3(window.ethereum.currentProvider);
    let networkId = await web3.eth.net.getId();
    console.log(1)
    let deployedNetwork = await SimpleStorageContract.networks[networkId];
    console.log(1)
    const newInstance = new web3.eth.Contract(
      SimpleStorageContract.abi,
      deployedNetwork && deployedNetwork.address,
    );
    console.log(1)
    this.setState({ contract: newInstance })
    console.log(this.state.contract)
  }

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    await contract.methods.set(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ storageValue: response });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Sample</h1>
        <p>Your Account: {this.state.accounts}</p>
        
        <div>The stored value is: {this.state.storageValue}</div>
        <button
        className="sample"
        onClick={(e) => this.runExample()}>button</button> 
        <div>
          <QRCode 
            value=""
            id="qrcode" 
          /> 
        </div>
        <button
          variant="outline-primary"
          onClick={(event) => {
            this.setQurageLink() }} >
          Link
        </button>  
        <button
          variant="outline-primary"
          onClick={(event) => {
            this.updateWeb3() }} >
          Web3 上書き
        </button>  
      </div>
    );
  }
}

export default App;
