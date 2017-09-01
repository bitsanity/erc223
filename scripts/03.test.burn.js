const Mod = require('./TOKLIB');
const web3 = Mod.getWeb3();
const contract = new web3.eth.Contract( Mod.getABI(), process.argv[2] );

var accounts = [];

web3.eth.getAccounts().then( (arr) =>
{
  accounts = arr;

  contract.methods.approve(accounts[0], 100000)
    .send({from:accounts[1]}).then( () =>
  {
    console.log( "approved 100000" );

    contract.methods.allowance(accounts[1], accounts[0]).call().then( (alw) =>
    {
      console.log( "allowance: ", alw );

      contract.methods.burn(200000)
        .send({from:accounts[1]}).then( () =>
      {
        console.log( "burned own coins" );

        contract.methods.burnFrom(accounts[1], 100000)
          .send({from:accounts[0]}).then( () =>
        {
          console.log( "burned pending transfer" );

          contract.methods.balanceOf(accounts[1]).call().then( (bal) =>
          {
            console.log( "a1's balance: ", bal );
          } );
        } );
      } );
    } );
  } );
} );

