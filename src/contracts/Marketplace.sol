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
        require(_id > 0 && _id <= productCount);
        Product memory _product = products[_id]; //copy of product in blockchain storage
        address payable _seller = _product.owner;
        string memory _name     = _product.name;

        //Change ownership
        _product.owner  = msg.sender;
        _product.purchased = true;
        //Update product in storage
        products[_id] = _product;
        //Transfer funds to previous owner
        address(_seller).transfer(msg.value);
        emit ProductPurchased(productCount,_name,msg.value, msg.sender, true);
    }
}