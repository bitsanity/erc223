//
// $ node this.js <token SCA> <to address> <numtokens>
//
// Assumes:
//   sending from the 0'th account
//

const Mod = require('./TOKLIB');
const web3 = Mod.getWeb3();
const contract = new web3.eth.Contract( Mod.getABI(), process.argv[2] );

var toaddr = process.argv[3];
var howmany = process.argv[4];

web3.eth.getAccounts().then( (arr) =>
{
  contract.methods.transfer( toaddr, howmany )
          .send({from:arr[0], gas:100000}).then( () =>
  {
    console.log( "transferred " + howmany + " to " + toaddr );
  } );
} );

