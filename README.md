# erc223

An implementation of ERC223 Token Standard. Supports Ethereum Token and ERC20
APIs.

## REQUIRES

 * node.js
 * solcjs
 * web3 1.0.0+
 * ethereumjs-testrpc

## INSTALL

run ./make.sh

This invokes solcjs compiler 0.4.15+ on the .sol files and dumps the resulting
abi's and bin's in the ./build subdirectory

$ cd scripts

$ node deployStub.js  (for testing)
prints address of a smart contract for testing callbacks
$ export STUB='value of SCA above'

$ node deployToken.js
prints SCA of the token contract
$ export SCA='value of SCA printed out above'

## TEST

$ node 01.test.init.js $SCA

$ node 02.test.approval.js $SCA
$ node 03.test.burn.js $SCA
$ node 04.test.callbacks.js $SCA $STUB

## VIEW EVENT LOGS

$ node events.js $SCA

$ node stubEvents.js $STUB

