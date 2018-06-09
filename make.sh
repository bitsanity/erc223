#!/bin/bash

commd=$1

if [ -z $commd ]
then
  echo compiling ...
  solcjs --bin --abi --optimize -o ./build TestStub.sol
  solcjs --bin --abi --optimize -o ./build ERC223Token.sol
  solcjs --bin --abi --optimize -o ./build MineableToken.sol
fi

if [ "$commd" = "clean" ]
then
  echo cleaning ...
  rm -rf build
fi
