const fs = require('fs');
const Web3 = require('web3');

const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

function getABI() {
  var contents = fs.readFileSync('../build/' +
                   '/TestStub_sol_TestStub.abi').toString();
  var abiObj = JSON.parse(contents);
  return abiObj;
}

function shorten(addr) {
  var saddr = "" + addr;
  return "0x" + saddr.substring(26);
}

const abi = getABI();
const contract = new web3.eth.Contract( getABI(), process.argv[2] );

contract.getPastEvents('allEvents',
                       {fromBlock: 0,
                        toBlock: 'latest'})
.then( (events) =>
{
  for (var ii =0; ii < events.length; ii++) {

    console.log(
      '--------------------------------------------------------------------' );

    if (events[ii].event == 'ApprovalReceived' )
    {
      console.log( "receiveApproval from: 0x" +
                   events[ii].raw.topics[1].substring(26) + " value: " +
                   parseInt(events[ii].raw.topics[2], 16) );
    }
    if (events[ii].event == 'TokenFallback')
    {
      console.log( "tokenFallback from: 0x" +
                   events[ii].raw.topics[1].substring(26) + " value: " +
                   parseInt(events[ii].raw.topics[2], 16) );
    }
    if (events[ii].event == 'CustomFallback')
    {
      console.log( "customFallback from: 0x" +
                   events[ii].raw.topics[1].substring(26) + " value: " +
                   parseInt(events[ii].raw.topics[2], 16) );
    }
  }
});

