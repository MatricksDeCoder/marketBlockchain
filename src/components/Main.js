import React, { Component } from 'react';

class Main extends Component {

  render() {
    return (
      <div id="content">
      
        <h1>Add Product</h1>
        <form onSubmit={(event) => {
          event.preventDefault();
          const name = this.productName.value;
          const price = window.web3.utils.toWei(this.productPrice.value.toString(), 'Ether');
          this.props.createProduct(name, price);
        }}>
          <div className="form-group mr-sm-2">
            <input
              id="productName"
              type="text"
              ref={(input) => { this.productName = input }}
              className="form-control"
              placeholder="Product Name"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="productPrice"
              type="text"
              ref={(input) => { this.productPrice = input }}
              className="form-control"
              placeholder="Product Price"
              required />
          </div>
          <button type="submit" className="btn btn-primary">Add Product</button>
        </form>
        <p>&nbsp;</p>
        <h2>Buy Product</h2>
        <div>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Id</th>
              <th scope="col">Name</th>
              <th scope="col">Price</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody id = "productList">
          {this.props.products.map((product,key) => {
            return (
                <tr key = {key}>
                  <th scope="row">{product.id.toString()}</th>
                  <td>{product.name}</td>
                  <td>{window.web3.utils.fromWei(product.price.toString(),'ether')} Eth</td>
                  <td>{product.owner}</td>
                  <td>
                    {!product.purchased ? 
                      <button 
                            name = {product.id}
                            value = {product.price}
                            className="buyButton"
                            onClick = {(event) => {
                                const id = event.target.name;
                                const price = event.target.value;
                                this.props.purchaseProduct(id,price);
                            }}
                      >Buy
                      </button> : null
                    }
                  </td>
                </tr>
            )
          })}           
          </tbody>
        </table>
        </div>        
      </div>
    );
  }
}

export default Main;
