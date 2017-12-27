// ===========================================================================
//
// $ node deploy.js
//
// compile and deploy contract from compiled
//
// NOTES:
//   > admin.startRPC("127.0.0.1", 8545, "*", "web3,db,net,eth")
//   > web3.personal.unlockAccount(eth.accounts[0], "password")
//
// ===========================================================================

var Mod = require('./TOKLIB');
const abi = Mod.getABI();
const web3 = Mod.getWeb3();
const bytecode = Mod.getBinary();
const contract = new web3.eth.Contract(abi);

var cb;
web3.eth.getAccounts().then( (res) => {
  cb = res[0];

  contract.deploy( {data: bytecode,
                    arguments: [1000000,'Test Token',0,'TOK'] })
          .send( {from: cb, gas: 2000000}, (err,res) =>
          {
            if (err) console.log(err);
            if (res) console.log(res);
          } )
          .then( (receipt) => {
            console.log( 'SCA: ', receipt.options.address );
          } );
} );
