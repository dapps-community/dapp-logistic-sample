pragma solidity ^0.4.15;

contract ClaimInterface {
    
    function getType()      constant returns (string _type);
    function getDetails()   constant returns (string  _why);
    function getInitiator() constant returns (address _who);
}

contract DamageClaim is ClaimInterface {
    
    string private constant CLAIM_TYPE = "DAMAGE";
    
    address private owned;
    string private details;
    
    function DamageClaim(string _details) {
        details = _details;
        owned = msg.sender;
    }
    
    function getType() public constant 
        returns (string _type) {
            return CLAIM_TYPE;
    }
    
    function getDetails() public constant
        returns (string  _why) {
            return details;
    }
    
    function getInitiator() public constant 
        returns (address _who) {
            return owned;
    }
}