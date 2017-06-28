#!/bin/bash -x

# conforme https://www.rinkeby.io/ --> connect yourself --> light

geth --datadir=$HOME/.rinkeby  --unlock 0 --password $HOME/rinkeby-senha.txt --light init rinkeby.json

geth --rpc --rpcaddr "0.0.0.0" --rpccorsdomain "*" --rpcapi "web3,net,personal,eth" --networkid=4 --datadir=$HOME/.rinkeby --unlock 0 --password $HOME/rinkeby-senha.txt --syncmode=light --ethstats='acdcjunior:Respect my authoritah!@stats.rinkeby.io' --bootnodes=enode://a24ac7c5484ef4ed0c5eb2d36620ba4e4aa13b8c84684e1b4aab0cebea2ae45cb4d375b77eab56516d34bfbd3c1a833fc51296ff084b770b94fb9028c4d25ccf@52.169.42.101:30303?discport=30304

# https://github.com/ethereum/go-ethereum/wiki/Command-Line-Options

# Para permitir que o outro container possa se conectar (RPC eh um protocolo)
# --rpc --rpcaddr "0.0.0.0" --rpccorsdomain "*"  \

# Permitir usar web3 no console
# https://ethereum.stackexchange.com/a/6563
# --rpcapi "web3,net,personal,eth" \

# Rede rinkeby
# --networkid=4 \

# Especifica o diretorio das accounts
# --datadir=$HOME/.rinkeby \

# Senha da account
# --password $HOME/rinkeby-senha.txt \

# Modo light, conforme https://www.rinkeby.io/ --> connect yourself --> light
# --syncmode=light --ethstats='acdcjunior:Respect my authoritah!@stats.rinkeby.io' --bootnodes=enode://a24a...d25ccf@52.169.42.101:30303?discport=30304
