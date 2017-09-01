//
// node 04.test.callbacks.js <tokenSCA> <stubSCA>
//

const fs = require('fs');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

function getABI(fpath) {
  var contents = fs.readFileSync(fpath).toString();
  var abiObj = JSON.parse(contents);
  return abiObj;
}

var abi = getABI('../build/ERC223Token_sol_ERC223Token.abi');
const erc223 = new web3.eth.Contract(abi,process.argv[2]);

abi = getABI('../build/TestStub_sol_TestStub.abi');
const stub = new web3.eth.Contract(abi,process.argv[3]);
var stubsca = stub.options.address;

var accounts = [];
web3.eth.getAccounts().then( (arr) =>
{
  accounts = arr;

  var context = '0x42';

  erc223.methods.approveAndCall( stubsca, 10000, context )
  .send( {from:accounts[1]} ).then( () =>
  {
    console.log( "called approveAndCall( tokenRecipient, ... )" );

    erc223.methods['transfer(address,uint256,bytes,string)']
      ( stubsca, 40000, context, 'customFallback(address,uint256,bytes)' )
    .send( {from:accounts[1]} ).then( () =>
    {
      console.log(
        "called transfer( ..., custom_fallback ) --> customFallback()" );

      erc223.methods['transfer(address,uint256,bytes)'](stubsca, 60000, context)
      .send( {from:accounts[1]} ).then( () =>
      {
        console.log( "called transfer( sca, ... ) --> tokenFallback()" );

        erc223.methods.balanceOf( stubsca ).call().then( (bal) =>
        {
          console.log( "stub's balance: ", bal );
        } );
      } );
    } );
  } );
} );

