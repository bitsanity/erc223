var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

console.log( 'version: ', web3.version );
web3.eth.getCompilers().then( (res) => {
  console.log( 'compilers: ', res );
});


