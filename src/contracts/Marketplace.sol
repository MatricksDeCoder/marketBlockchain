pragma solidity >=0.4.21 <0.6.0;

contract Marketplace {

    string public name;
    uint public productCount;
    mapping(uint => Product) public products;

    struct Product {
        uint id;
        string name;
        uint price;
        address payable owner;
        bool purchased;
    }

    event ProductCreated(  
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased
        );

    event ProductPurchased(  
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased
        );

    constructor() public {
        name = "Marketplace";
    }

    function createProduct(string memory _name, uint _price) public {
        require(bytes(_name).length>0);
        require(_price > 0);
        productCount++;
        products[productCount] = Product(productCount, _name, _price, msg.sender, false);
        emit ProductCreated(productCount, _name, _price, msg.sender, false);
    }

    function purchaseProduct(uint _id) public payable {
       
        Product memory _product = products[_id]; //copy in memory of product in blockchain storage
        address payable _seller = _product.owner;
        require(_product.id > 0 && _product.id <= productCount);
        require(msg.value >= _product.price);
        require(!_product.purchased);
        require(msg.sender != _seller);
        //Change ownership
        _product.owner  = msg.sender;
        _product.purchased = true;
        //Update product in storage
        products[_id] = _product;
        //Transfer funds to previous owner
        address(_seller).transfer(msg.value);
        emit ProductPurchased(productCount,_product.name,msg.value, msg.sender, true);
    }
}