const fs = require('fs');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

function getABI() {
  var contents = fs.readFileSync('../build/' +
                   '/TestStub_sol_TestStub.abi').toString();
  var abiObj = JSON.parse(contents);
  return abiObj;
}

const abi = getABI();
const bytecode = fs.readFileSync('../build/' +
                                 '/TestStub_sol_TestStub.bin').toString();

const contract = new web3.eth.Contract(abi);

var cb;
web3.eth.getCoinbase().then( (res) => {
  cb = res;

  contract.deploy( {data: bytecode, arguments: [] })
          .send( {from: cb, gas: 2000000}, (err,res) =>
          {
            if (err) console.log(err);
            if (res) console.log(res);
          } )
          .then( (receipt) => {
            console.log( 'SCA: ', receipt.options.address );
          } );
} );

