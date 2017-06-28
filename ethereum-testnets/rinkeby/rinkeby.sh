#!/bin/bash -x

# conforme https://www.rinkeby.io/ --> connect yourself --> light

# https://github.com/ethereum/go-ethereum/wiki/Command-Line-Options
geth --datadir=$HOME/.rinkeby --password $HOME/rinkeby-senha.txt --light init rinkeby.json

geth --rpc --rpcaddr "0.0.0.0" --rpccorsdomain "*" --networkid=4 --datadir=$HOME/.rinkeby --password $HOME/rinkeby-senha.txt --syncmode=light --ethstats='yournode:Respect my authoritah!@stats.rinkeby.io' --bootnodes=enode://a24ac7c5484ef4ed0c5eb2d36620ba4e4aa13b8c84684e1b4aab0cebea2ae45cb4d375b77eab56516d34bfbd3c1a833fc51296ff084b770b94fb9028c4d25ccf@52.169.42.101:30303?discport=30304

# DESCRICAO DOS ARGUMENTOS

# Para permitir que o outro container possa se conectar
# --rpc --rpcaddr "0.0.0.0" --rpccorsdomain "*"

# Rede rinkeby
# --networkid=4
