const Mod = require('./TOKLIB');
const web3 = Mod.getWeb3();
const contract = new web3.eth.Contract( Mod.getABI(), process.argv[2] );

var accounts = [];

web3.eth.getAccounts().then( (arr) =>
{
  accounts = arr;

  contract.methods.approve(accounts[1], 500000)
    .send({from:accounts[0]}).then( () =>
  {
    console.log( "approved 500000" );

    contract.methods.allowance(accounts[0], accounts[1]).call().then( (alw) =>
    {
      console.log( "allowance: ", alw );

      contract.methods.transferFrom(accounts[0], accounts[1], 500000)
        .send({from:accounts[1]}).then( () =>
      {
        console.log( "transferred allowance" );

        contract.methods.transfer(accounts[1], 500000)
          .send({from:accounts[0]}).then( () =>
        {
          console.log( "transferred remainder" );

          contract.methods.balanceOf(accounts[1]).call().then( (bal) =>
          {
            console.log( "a1's balance: ", bal );
          } );
        } );
      } );
    } );

  } );
} );

