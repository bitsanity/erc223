const fs = require('fs');
const Web3 = require('web3');
const web3 =
  new Web3(new Web3.providers.WebsocketProvider("ws://localhost:8545"));

const MYGASPRICE = '' + 8 * 1e9;

function getABI() {
  return JSON.parse( fs.readFileSync(
    '../build/MineableToken_sol_MineableToken.abi').toString() );
}

function getBinary() {
  var binary = fs.readFileSync('../build/MineableToken_sol_MineableToken.bin')
    .toString();

  if (!binary.startsWith('0x')) binary = '0x' + binary;
  return binary;
}

function getContract(sca) {
  return new web3.eth.Contract( getABI(), sca );
}

function printEvent(evt) {
  console.log( evt.event + ': ' + JSON.stringify(evt.returnValues) + '\n' );
}

const cmds = [
   'deploy',
   'events',
   'variables',
   'changeOwner',
   'mine',
   'burn',
   'burnFrom',
   'balanceOf',
   'approve',
   'safeApprove',
   'allowance',
   'approveAndCall',
   'transfer',
   'transferFrom',
   'transferAndCall',
   'transferWithData'
  ];

function usage() {
  console.log(
    '\nUsage:\n$ node cli.js <acctindex> <SCA> <command> [arg]*\n',
     'Commands:\n',
     '\tdeploy <decimals> <name> <symbol> |\n',
     '\tevents |\n',
     '\tvariables |\n',
     '\tchangeOwner <newowner> |\n',
     '\tmine <quantity> <toaddress> |\n',
     '\tburn <quantity> |\n',
     '\tburnFrom <address> <quantity> |\n',
     '\tbalanceOf <address> |\n',
     '\tapprove <spender> <quantity> |\n',
     '\tsafeApprove <spender> <currentquantity> <quantity> |\n',
     '\tallowance <owner> <spender> |\n',
     '\tapproveAndCall <spender> <quantity> <contexthex> |\n',
     '\ttransfer <to> <quantity> |\n',
     '\ttransferFrom <owner> <to> <quantity> |\n',
     '\ttransferAndCall <to> <quantity> <calldatahex> <customfallbackstr> |\n',
     '\ttransferWithData <to> <quantity> <calldatahex> |\n'
  );
}

var cmd = process.argv[4];

let found = false;
for (let ii = 0; ii < cmds.length; ii++)
  if (cmds[ii] == cmd) found = true;

if (!found) {
  usage();
  process.exit(1);
}

var ebi = process.argv[2]; // local account index
var sca = process.argv[3];

console.log( 'ix: ' + ebi + ', cmd: ' + cmd );

var eb;
web3.eth.getAccounts().then( (res) => {
  eb = res[ebi];

  if (cmd == 'deploy') {
    let dec = process.argv[5];
    let name = process.argv[6];
    let sym = process.argv[7];

    let con = new web3.eth.Contract( getABI() );
    con.deploy( {data:getBinary(), arguments: [dec, name, sym]} )
      .send({from: eb, gas: 2000000, gasPrice: MYGASPRICE}, (err, hash) => {
        if (err) console.log( err.toString() );
      } )
      .on('error', (err) => { console.log("err: ", err.toString()); })
      .on('transactionHash', (h) => { console.log( "hash: ", h ); } )
      .on('receipt', (r) => { console.log( 'rcpt: ' + r.contractAddress); } )
      .on('confirmation', (cn, rcpt) => { console.log( 'cn: ', cn ); } )
      .then( (nin) => {
        console.log( "SCA: ", nin.options.address );
        process.exit(0);
      } );
  }
  else {
    let con = new web3.eth.Contract( getABI(), sca );

    if (cmd == 'events') {
      con.getPastEvents('allEvents', {fromBlock: 0, toBlock: 'latest'})
      .then( (events) => {

        for (var ii = 0; ii < events.length; ii++)
          printEvent( events[ii] );

        process.exit(0);
      } )
      .catch( err => {
        console.log(err.toString());
        process.exit(1);
      } );
    }

    if (cmd == 'variables') {
      web3.eth.getBalance( sca ).then( (bal) => {
        console.log( "balance (wei): " + bal )
      } ).catch( err => { console.log(err.toString()) } );

      con.methods.owner().call().then( (own) => {
        console.log( "owner: " + own )
      } ).catch( err => { console.log(err.toString()) } );

      con.methods.name().call().then( (nam) => {
        console.log( "name: " + nam )
      } ).catch( err => { console.log(err.toString()) } );

      con.methods.symbol().call().then( (sym) => {
        console.log( "symbol: " + sym )
      } ).catch( err => { console.log(err.toString()) } );

      con.methods.decimals().call().then( (dec) => {
        console.log( "decimals: " + dec )
      } ).catch( err => { console.log(err.toString()) } );

      con.methods.totalSupply().call().then( (spy) => {
        console.log( "totalSupply: " + spy )
      } ).catch( err => { console.log(err.toString()) } );

      setTimeout( () => { process.exit(0); }, 1000 );
    }

    if (cmd == 'changeOwner') {
      let to = process.argv[5];

      con.methods.changeOwner( to )
      .send( {from: eb, gas: 100000, gasPrice: MYGASPRICE} )
      .then( () => { process.exit(0); } )
      .catch( err => { console.log(err.toString()); process.exit(1); } );
    }

    if (cmd == 'mine') {
      let qty = process.argv[5], to = process.argv[6];

      con.methods.mine( qty, to )
      .send( {from:eb,gas:100000,gasPrice:MYGASPRICE} )
      .then( () => { process.exit(0); } )
      .catch( err => { console.log(err); process.exit(1); } );
    }

    if (cmd == 'burn') {
      let qty = process.argv[5];

      con.methods.burn( qty )
      .send( {from:eb,gas:100000,gasPrice:MYGASPRICE} )
      .then( () => { process.exit(0); } )
      .catch( err => { console.log(err); process.exit(1); } );
    }

    if (cmd == 'burnFrom') {
      let addr = process.argv[5], qty = process.argv[6];

      con.methods.burnFrom( addr, qty )
      .send( {from:eb,gas:100000,gasPrice:MYGASPRICE} )
      .then( () => { process.exit(0); } )
      .catch( err => { console.log(err); process.exit(1); } );
    }

    if (cmd == 'balanceOf') {
      let addr = process.argv[5];

      con.methods.balanceOf( addr ).call().then( (bal) => {
        console.log( addr + ": " + bal );
        process.exit(0);
      } ).catch( err => { console.log(err.toString()); process.exit(1); } );
    }

    if (cmd == 'approve') {
      let spender = process.argv[5], quantity = process.argv[6];

      con.methods.approve( spender, quantity )
      .send( {from:eb,gas:100000,gasPrice:MYGASPRICE} )
      .then( () => { process.exit(0); } )
      .catch( err => { console.log(err); process.exit(1); } );
    }

    if (cmd == 'safeApprove') {
      let spender = process.argv[5],
        currquant = process.argv[6],
        quant = process.argv[7];

      console.log( 'safeApprove ' + spender + ' ' + currquant + ' ' + quant );

      con.methods.safeApprove( spender, currquant, quant )
      .send( {from:eb,gas:100000,gasPrice:MYGASPRICE} )
      .then( () => { process.exit(0); } )
      .catch( err => { console.log(err); process.exit(1); } );
    }

    if (cmd == 'allowance') {
      let owner = process.argv[5], spender = process.argv[6];

      con.methods.allowance( owner, spender ).call().then( (all) => {
        console.log( "allowance: " + all );
        process.exit( 0 );
      } ).catch( err => { console.log(err.toString()) } );
    }

    if (cmd == 'approveAndCall') {
      let spender = process.argv[5],
        quant = process.argv[6],
        ctxt = process.argv[7];

      con.methods.approveAndCall( spender, quant, ctxt )
      .send( {from:eb,gas:200000,gasPrice:MYGASPRICE} )
      .then( () => { process.exit(0); } )
      .catch( err => { console.log(err); process.exit(1); } );
    }

    if (cmd == 'transfer') {
      let to = process.argv[5], quant = process.argv[6];

      con.methods.transfer( to, quant )
      .send( {from:eb,gas:100000,gasPrice:MYGASPRICE} )
      .then( () => { process.exit(0); } )
      .catch( err => { console.log(err); process.exit(1); } );
    }

    if (cmd == 'transferFrom') {
      let owner = process.argv[5],
        to = process.argv[6],
        quant = process.argv[7];

      con.methods.transferFrom( owner, to, quant )
      .send( {from:eb,gas:200000,gasPrice:MYGASPRICE} )
      .then( () => { process.exit(0); } )
      .catch( err => { console.log(err); process.exit(1); } );
    }

    if (cmd == 'transferAndCall') {
      let to = process.argv[5],
        quant = process.argv[6],
        calldata = process.argv[7],
        fallback = process.argv[8];

      con.methods.transfer( to, quant, calldata, fallback )
      .send( {from:eb,gas:500000,gasPrice:MYGASPRICE} )
      .then( () => { process.exit(0); } )
      .catch( err => { console.log(err); process.exit(1); } );
    }

    if (cmd == 'transferWithData') {
      let to = process.argv[5],
        quant = process.argv[6],
        calldatahex = process.argv[7];

      con.methods.transfer( to, quant, calldatahex )
      .send( {from:eb,gas:200000,gasPrice:MYGASPRICE} )
      .then( () => { process.exit(0); } )
      .catch( err => { console.log(err); process.exit(1); } );
    }

  }
} );
