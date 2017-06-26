pragma solidity ^0.4.4;


/// @title Catalogo de Ouvidorias para o Barramento de Ouvidorias
contract CatalogoOuvidorias {

    enum TipoEnte { Uniao, Estado, Municipio }

    struct Ente {
        TipoEnte tipo;
        string nome;   // nome do ente, caso se aplique (Uniao nao eh necessario). Ex.: 'Bahia', 'Salvador-BA'
    }

    struct Ouvidoria {
        address conta; // account Ethereum desta ouvidoria
        string nome;   // nome do orgao
        Ente ente; // ente a qual a ouvidoria pertence
        bytes endpoint;   // URL da aplicacao/web service desta ouvidoria
    }

    Ouvidoria[] private ouvidorias;

    function CatalogoOuvidorias(/* conta1 == sender */ string nome1, uint8 tipoEnte1, string nomeEnte1, bytes endpoint1
//                                       address conta2, string nome2, uint8 tipoEnte2, string nomeEnte2, bytes endpoint2,
//                                       address conta3, string nome3, uint8 tipoEnte3, string nomeEnte3, bytes endpoint3
    ) {
        ouvidorias.push(Ouvidoria({
            conta: msg.sender,
            nome: nome1,
            ente: Ente({tipo: toTipoEnte(tipoEnte1), nome: nomeEnte1}),
            endpoint: endpoint1
        }));
    }

    function toTipoEnte(uint8 tipo) returns (TipoEnte) {
        if (tipo == 0) return TipoEnte.Uniao;
        if (tipo == 1) return TipoEnte.Estado;
        if (tipo == 2) return TipoEnte.Municipio;
        throw;
    }

}
