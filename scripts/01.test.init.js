//
// $ node <this>.js <SCA>
//

const Mod = require('./TOKLIB');
const web3 = Mod.getWeb3();
const contract = new web3.eth.Contract( Mod.getABI(), process.argv[2] );

var cb = "";

web3.eth.getCoinbase().then( (res) => {
  cb = "" + res;
  console.log('cb: ', res);
} ).then( function() {

  contract.methods.balanceOf(cb).call().then( (res) => {
    console.log( 'bal: ', res );
  } );

  contract.methods.owner().call().then( (ow) => {
    console.log( "ow: ", ow );
    Mod.assert( ow.toUpperCase() == cb.toUpperCase(), "owner" );
  } );

} );

contract.methods.totalSupply().call().then( (ts) => {
  console.log( "ts: ", ts );
  Mod.assert( ts == 1000000, "totalSupply" );
} );

contract.methods.decimals().call().then( (dc) => {
  console.log( "dc: ", dc );
} );

contract.methods.symbol().call().then( (sm) => {
  console.log( "sm: ", sm );
} );

contract.methods.name().call().then( (nm) => {
  console.log( "nm: ", nm );
} );
