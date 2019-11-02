import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3';
import Marketplace from '../abis/Marketplace.json';
import Main from './Main';
import Navbar from './Navbar';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      marketplaceContract:'',
      account: '',
      products: [],
      productCount: 0,
      loading:true
    }
    this.createProduct   = this.createProduct.bind(this);
    this.purchaseProduct = this.purchaseProduct.bind(this);
  }

  createProduct(name, price) {
    this.setState({ loading: true });
    this.state.marketplaceContract.methods.createProduct(name, price).send({ from: this.state.account })
                                                                     .once('receipt', (receipt) => {
                                                                        this.setState({ loading: false });
                                                                      });
  }

  purchaseProduct(productId,price) {
    this.setState({loading:true});
    this.state.marketplaceContract.methods.purchaseProduct(productId).send({from:this.state.account, value:price})
                                                                     .once('receipt', (receipt) => {
                                                                      this.setState({ loading: false });
                                                                     });
  }

  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3() { //connect with Metamask

      if (window.ethereum) {
          window.web3 = new Web3(window.ethereum);
          await window.ethereum.enable();
      } else if (window.web3) { //Legacy browsers
          window.web3 = new Web3(window.web3.currentProvider);
          //web3.eth.sendTransaction({});//Accounts always exposed
      }
      else {
          window.alert("Non-ethereum browser detected! Please install/use Metamask!");
      }

  }

  async loadBlockchainData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts(); 
    //console.log(account);
    this.setState({account:accounts[0]});

    //Detect network dynamically
    const netId = await web3.eth.net.getId();
    const netData = Marketplace.networks[netId];

    if(netData) {
      const marketplaceContract = await web3.eth.Contract(Marketplace.abi,netData.address);
      this.setState({marketplaceContract: marketplaceContract});
      const productCount = await marketplaceContract.methods.productCount().call();
      this.setState({productCount:productCount});
      //console.log(productCount);
      for (let i=1; i<=productCount;i++) {
        const product = await marketplaceContract.methods.products(i).call();
        this.setState({
          products: [...this.state.products,product]
        })
      }
      //console.log(this.state.products);
      this.setState({loading:false});
    } else {
      window.alert("Marketplace contract not deployed on that network! Please change network!");
    }
    
  }

  render() {
    return (
    <div >
      <Navbar account = {this.state.account} />
      <div className = 'container mt-5'>
        <div className = 'row'>
          <main role='main' className = 'col-lg-12 d-flex'>
            {this.state.loading ? <div>Loading</div> : <Main 
                                                            purchaseProduct = {this.purchaseProduct}
                                                            createProduct = {this.createProduct} 
                                                            products      = {this.state.products}
                                                        />}   
          </main>
        </div>  
      </div >
    </div>
    );
  }
}

export default App;
