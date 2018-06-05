var RDWToken = artifacts.require("RDWToken");

contract('RDWToken', function(accounts) {
  let contract;
  
  //mint tokens (example above): 
  beforeEach(async () => {
    contract = await RDWToken.new();
  });

  it("should put 10000 RDWToken in the first account", async function() {
    //act
    await contract.mint(10000, {from: accounts[0]});

    //assert
    const balance = await contract.balanceOf(accounts[0]);
    assert.equal(parseInt(balance), 10000, "10000 wasn't in the first account");
  });
  
  //mint tokens twice
  beforeEach(async () => {
    contract = await RDWToken.new();
  });

  it("assert balance: should put 100 RDWToken in the first account, followed by 200 more", async function() {
    //act
    await contract.mint(100, {from: accounts[0]});
    await contract.mint(200, {from: accounts[0]});

    //assert
    const balance = await contract.balanceOf(accounts[0]);
    assert.equal(parseInt(balance), 300, "300 wasn't in the first account");
  });

  //tranfer tokens, assert balances
  beforeEach(async () => {
    contract = await RDWToken.new();
  });

  it("tranfer 750 tokens from account1 to account2, assert balances", async function() {
    //arrange
    await contract.mint(1000, {from: accounts[0]});
	
	//act
	contract.transfer(accounts[1], 750);
	
    //assert
    const balanceFrom = await contract.balanceOf(accounts[0]);
    assert.equal(parseInt(balanceFrom), 250, " wasn't in the first account");
    const balanceTo = await contract.balanceOf(accounts[1]);
    assert.equal(parseInt(balanceTo), 750, " wasn't in the second account");
  });

  //transfer token when not enough balance (should throw exception)
  it("transfer token when not enough balance (should throw exception)", async function() {
    //arrange
    await contract.mint(700, {from: accounts[0]});
	try
	{
      //act
	  await contract.transfer(accounts[1], 750);
	}
	catch(err)
	{
  	  const balance = await contract.balanceOf(accounts[0]);
	  assert.equal(parseInt(balance), 700, " wasn't in the first account");
	  return;
	}
	assert.fail();
    //assert
  });  
});