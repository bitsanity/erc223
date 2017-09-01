#!/bin/bash

solcjs --bin --abi -o ./build ERC223Token.sol
solcjs --bin --abi -o ./build TestStub.sol

