pragma solidity ^0.4.23;

import "./RDWToken.sol";

contract RDW {
    address private owner;
    address private tokenContract;

    address[] private roadManagers;
    uint256 private roadManagersAmount = 0;
    
    address[] private routes;
    uint256 private routesAmount = 0;

    modifier onlyOwner {
        if(msg.sender != owner) revert();
        _;
    }

    constructor(address _tokenContract) public {
        owner = msg.sender;
        tokenContract = _tokenContract;
    }

    function getTokenContract() view public returns(address) {
        return tokenContract;
    }

    function addRoadManager(address _roadManager) public onlyOwner {
        roadManagers.push(_roadManager);
        roadManagersAmount += 1;
    }

    function getRoadManager(uint256 _index) view public returns(address) {
        return roadManagers[_index];
    }

    function getRoadManagersAmount() view public returns(uint256) {
        return roadManagersAmount;
    }

    function addRoute(address _route) public onlyOwner {
        routes.push(_route);
        routesAmount += 1;
    }

    function getRoute(uint256 _index) view public returns(address) {
        return routes[_index];
    }

    function getRoutesAmount() view public returns(uint256) {
        return routesAmount;
    }
}