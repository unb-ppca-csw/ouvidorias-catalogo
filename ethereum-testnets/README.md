Aparentemente existem várias testnets.

Três grandes, pra ser preciso: https://testnet.etherscan.io/ 

# Rinkeby

Account: [`0x1750dd0f8cd22ee9d849ab11ebc62adb37ffc10a`](https://rinkeby.etherscan.io/address/0x1750dd0f8cd22ee9d849ab11ebc62adb37ffc10a)

- principal: https://www.rinkeby.io/
- web3 provider: https://rinkeby.infura.io
- block explorer: https://rinkeby.etherscan.io/

Funciona muito bem.

```shell
# Subir 2 cointainers no background (-d)
$ docker-compose up --build -d

# Acesse o console
$ docker attach rinkerby_gethconsole_1

# Lá dentro, pressione seta pra cima, pra pegar o histórico, que vai abrir o comando:
root@...> cd ~ && chmod +x geth-attach-rinkeby.sh && ./geth-attach-rinkeby.sh

    Welcome to the Geth JavaScript console!
    
    instance: Geth/v1.6.5-stable-cf87713d/linux-amd64/go1.8.1
     modules: eth:1.0 net:1.0 personal:1.0 rpc:1.0 web3:1.0
    
    > 


# Verifique o saldo da conta primaria (se acontecer erro, tente novamente)
> eth.getBalance(eth.accounts[0])
```


# Ropsten

Aparentemente, a `morden` morreu e essa nasceu no lugar.
https://blog.ethereum.org/2016/11/20/from-morden-to-ropsten/

https://ropsten.etherscan.io/address/0x414591e821aff891644de40e64e86af3c8f7c8b6

Account: `0x414591e821aff891644de40e64e86af3c8f7c8b6`

https://github.com/Kunstmaan/docker-ethereum

- Faucets
    - https://www.reddit.com/r/ethereum/comments/4s5bxp/how_to_mine_ether_on_testnet/
    - http://faucet.ropsten.be:3001/
    - https://blog.b9lab.com/when-we-first-built-our-faucet-we-deployed-it-on-the-morden-testnet-70bfbf4e317e
    - http://ipfs.b9lab.com:8080/ipfs/QmTHdYEYiJPmbkcth3mQvEQQgEamFypLhc9zapsBatQW7Y/throttled_faucet.html

