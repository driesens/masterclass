const assert = require("assert");

const RDWToken = artifacts.require("./RDWToken.sol");
const SafeRoute = artifacts.require("./SafeRoute.sol");

contract("SafeRoute", (accounts) => {
  let token;
  let contract;

  beforeEach(async () => {
    token = await RDWToken.new();
    contract = await SafeRoute.new("hash", "http://pointer", token.address);
  });

  it("should have correct balance", async () => {
    //act
    await contract.addRoadManager(accounts[1], 100);

    //assert
    const balance = await token.balanceOf(contract.address);
    assert.equal(balance, 100)
  });
  
  it("should withdraw tokens", async () => {
    //arrange
    await contract.addRoadManager(accounts[1], 100);

    //act
    await contract.withdraw({from: accounts[1]});

    //assert
    const contractBalance = await token.balanceOf(contract.address);
    assert.equal(contractBalance, 0)
    const managerBalance = await token.balanceOf(accounts[1]);
    assert.equal(managerBalance, 100)
  });
});