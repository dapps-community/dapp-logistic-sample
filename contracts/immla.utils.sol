pragma solidity ^0.4.15;


/* @title - Access control utilities */
contract AC {
    
    /**
    *   @dev - Contract provides roles management and access control.
    *          There are 2 roles: owner - creator of the contract and
    *          manager - person who is responsible for administrative facilities.
    * 
    *   TODO - need to implement multiple managers functionality
    */
    
    using Preconditions for address;
    
    address internal owner;
    address internal manager;
    
    function AC(address _manager) {
        require(!_manager.isInvalidAddr());
        owner = msg.sender;
        manager = _manager;
    }
    
    function setManager(address _manager) internal {
        require(!_manager.isInvalidAddr());
        manager = _manager;
    }
    
    function changeManager(address _manager) public;
    
    modifier onlyOwner   { require(msg.sender == owner);    _; }
    modifier onlyManager { require(msg.sender == manager);  _; }
}


/* @title - Life Cycle of the Contract */
contract LiveCycle {
    
    /**
    *   @dev - There are 4 states of Contract exist:
    *            Running - contact is avaliable for calling
    *            Paused  - Contract is suspended. Contact is temprorary blocked
    *                      and only administrative functions are available
    *            Closed  - contract is finally closed
    *            Interrupted  - contract is stopped suddenly by some reasons
    */
    
    using Preconditions for byte;
    
    byte constant internal Paused      = 0x1;
    byte constant internal Running     = 0x2;
    byte constant internal Closed      = 0x4;
    byte constant internal Interrupted = 0x8;
    
    byte public state = Paused;
    
    // Paused -> Running
    function isRunAvaliable() private constant
        returns(bool) {
            return (state == Paused);
    }
    
    // Running -> Paused
    function isSuspendAvailable() private constant
        returns(bool) {
            return (state == Running);
    }
    
    // Paused -> Closed
    function isCloseAvailable() private constant
        returns(bool) {
            return (state == Paused);
    }
    
    // Running|Paused -> Interrupted
    function isInterruptAvailable() private constant
        returns(bool) {
            return (state == Running) || (state == Paused);
    }
    
    function changeState(byte _state) internal
        returns(byte) {
            if(state == _state)
                return state;
                
            if(_state == Running) require(isRunAvaliable());
            else if(_state == Paused) require(isSuspendAvailable());
            else revert();
            
            LogChangeState(state, _state);
            state = _state;
            return state;
    }
    
    function interrupt() internal {
        require(isInterruptAvailable());
                
        LogChangeState(state, Interrupted);
        state = Interrupted;
    }
    
    function close() internal {
        require(isCloseAvailable());
        
        LogChangeState(state, Closed);
        state = Closed;
    }
    
    function isRunning() public constant 
        returns(bool) {
            return (state == Running);
    }
    
    function switchTo(byte _state) public;
    
    modifier atState(byte _states) { require(!Preconditions.isEmpty(_states & state)); _; }
    
    event LogChangeState(byte _from, byte _to);
}


/* @title - Preliminary data verifications */
library Preconditions {
    
    /**
    *   @dev - Fundamental function to validate different data types
    *          Functions are not generates exceptions and can be handled
    *          on the client side
    */
    
    /* @dev - check that byte is null */
    function isEmpty(byte _val) constant internal
        returns(bool) {
            return (byte(0) == _val);
    }
    
    /* @dev - check that string is empty */
    function isEmpty(string _val) constant internal
        returns(bool) {
            return (0 == bytes(_val).length);
    }
    
    /* @dev - are two strings equal */
    function isEqual(string _a, string _b) constant internal
        returns (bool) {
            bytes memory a = bytes(_a);
            bytes memory b = bytes(_b);
            
            if(a.length != b.length)
                return false;
        
            for (uint i = 0; i < b.length; i++)
                if(a[i] != b[i])
                    return false;

            return true;
    }
    
    /* @dev - check the address correctness */
    function isInvalidAddr(address _addr) constant internal
        returns (bool) {
            return (address(0) == _addr);
    }
}
