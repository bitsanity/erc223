pragma solidity ^0.4.15;

// smart contract test stub, able to hold ERC223 tokens and handle all the
// callbacks. Just confirms being called by pushing an event for each function.

contract TestStub
{
  event ApprovalReceived( address indexed from,
                          uint256 value,
                          bytes   data );

  event TokenFallback( address indexed from,
                       uint256 value,
                       bytes   data );

  event CustomFallback( address indexed from,
                        uint256 value,
                        bytes   data );

  // https://www.ethereum.org/token
  // function in contract 'tokenRecipient'
  function receiveApproval( address from, uint256 value, bytes data )
  {
    ApprovalReceived(from, value, data);
  }

  // ERC223
  // function in contract 'ContractReceiver'
  function tokenFallback( address from, uint value, bytes data )
  {
    TokenFallback(from, value, data);
  }

  // ERC223
  function customFallback( address from, uint value, bytes data )
  {
    CustomFallback(from, value, data);
  }

}

