FROM kunstmaan/ethereum-geth

MAINTAINER acdcjunior

ADD ./keystore /root/.keystore
ADD ./rinkeby-senha.txt /root/rinkeby-senha.txt
ADD ./rinkeby.sh /root/rinkeby.sh
ADD ./rinkeby.json /root/rinkeby.json
RUN chmod +x /root/rinkeby.sh

WORKDIR /root

CMD /root/rinkeby.sh
