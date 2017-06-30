#!/bin/bash -x

# Troque pela sigla da nossa universidade, todas as letras em minusculo, tres letras mesmo
echo "<sigla aqui>" > ~/.accountpassword
echo "Address: {414591e821aff891644de40e64e86af3c8f7c8b6}" > ~/.primaryaccount

# Generate and store a wallet password
if [ ! -f ~/.accountpassword ]; then
    echo `date +%s | sha256sum | base64 | head -c 32` > ~/.accountpassword
fi

if [ ! -f ~/.primaryaccount ]; then
    geth --testnet --password ~/.accountpassword account new > ~/.primaryaccount
fi

geth --rpc --rpcaddr "0.0.0.0" --rpccorsdomain "*" --testnet --password ~/.accountpassword --mine --minerthreads 1 --extradata "Kunstmaan"
