const Mod = require('./TOKLIB');
const web3 = Mod.getWeb3();
const contract = new web3.eth.Contract( Mod.getABI(), process.argv[2] );

function shorten(addr) {
  var saddr = "" + addr;
  return "0x" + saddr.substring(25);
}

contract.getPastEvents('allEvents',
                       {fromBlock: 0,
                        toBlock: 'latest'})
.then( (events) =>
{
  for (var ii =0; ii < events.length; ii++) {
    console.log(
      '--------------------------------------------------------------------' );

    if (events[ii].event == 'Approval' )
    {
      console.log( "Approved " + shorten(events[ii].raw.topics[2]) +
                  " to retrieve " + parseInt(events[ii].raw.data,16) +
                  " tokens from " +
                  shorten(events[ii].raw.topics[1]) );
    }
    if (events[ii].event == 'Transfer')
    {
      console.log( "Transferred " + parseInt(events[ii].raw.data,16) +
                   " tokens from " + shorten(events[ii].raw.topics[1]) +
                   " to " + shorten(events[ii].raw.topics[2]) );
    }
    if (events[ii].event == 'Burn')
    {
      console.log( "Burned " + parseInt(events[ii].raw.data,16) +
                   " tokens from " + shorten(events[ii].raw.topics[1]) );
    }
  }
});

