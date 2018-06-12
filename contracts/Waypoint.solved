pragma solidity ^0.4.23;

contract Waypoint {
  address public owner;
  struct location {
    int32 lon;
	int32 lat;
  }
  
  mapping(location => address) waypoints;
  
  constructor() public {
    owner = msg.sender;
  }

  modifier restricted() {
    if (msg.sender == owner) _;
  }
  
  function addWaypoint(location _waypoint , address _roadManager) public onlyOwner {
	waypoints[_waypoint] = _roadManager;
  }

  
  
}
