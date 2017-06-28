pragma solidity ^0.4.11;

/// @title Catalogo de Ouvidorias para o Barramento de Ouvidorias
/*
    Cada ouvidoria somente pode autorizar uma vez.
*/
contract CatalogoOuvidorias {

    enum TipoEnte { Uniao, Estado, Municipio }

    struct Ente {
        TipoEnte tipo;
        bytes32 nome;   // nome do ente, caso se aplique (Uniao nao eh necessario). Ex.: 'Bahia', 'Salvador-BA'
    }

    struct Ouvidoria {
        address conta; // account Ethereum desta ouvidoria
        bytes32 nome;   // nome do orgao
        Ente ente; // ente a qual a ouvidoria pertence
        bytes32 endpoint;   // URL da aplicacao/web service desta ouvidoria

        // variavel de controle pq o solidity eh peh duro e nao fornece maneiras de testar se uma chave existe no map
        // https://ethereum.stackexchange.com/a/13029
        // https://ethereum.meta.stackexchange.com/questions/443/blog-simple-storage-patterns-in-solidity
        bool existe;
    }

    address[] enderecosOuvidorias;

    mapping(address => Ouvidoria) private ouvidorias;

    mapping(address => address[]) public ouvidoriasCandidatasComAutorizacoes;

    event ouvidoriasAtualizadas(address conta, bytes32 nome, uint8 tipoEnte, bytes32 nomeEnte, bytes32 endpoint);

    event debug(address endereco, bytes32 texto, bool booleano);

    /// Cria o catalogo com uma ouvidoria -- nao exigi tres porque seriam tantas variaveis que o solarity nao permite:
    /// Compiler error (...): Stack too deep, try removing local variables.
    function CatalogoOuvidorias(bytes32 nome, uint8 tipoEnte, bytes32 nomeEnte, bytes32 endpoint) {
        ouvidorias[msg.sender] = Ouvidoria({
            conta: msg.sender,
            nome: nome,
            ente: Ente({tipo: toTipoEnte(tipoEnte), nome: nomeEnte}),
            endpoint: endpoint,
            existe: true
        });
        enderecosOuvidorias.push(msg.sender);
    }

    function toTipoEnte(uint8 tipo) returns (TipoEnte) {
        if (tipo == 0) return TipoEnte.Uniao;
        if (tipo == 1) return TipoEnte.Estado;
        if (tipo == 2) return TipoEnte.Municipio;
        throw;
    }

    function getNumeroDeOuvidorias() constant returns (uint) {
        return enderecosOuvidorias.length;
    }

    function getEnderecoOuvidoria(uint i) constant returns (address) {
        return enderecosOuvidorias[i];
    }

    function getOuvidoriaNome(address ouvidoria) constant returns (string) {
        return toString(ouvidorias[ouvidoria].nome);
    }

    function getOuvidoriaEndpoint(address ouvidoria) constant returns (string) {
        return toString(ouvidorias[ouvidoria].endpoint);
    }

    function getOuvidoriaEnteTipo(address ouvidoria) constant returns (uint) {
        return uint(ouvidorias[ouvidoria].ente.tipo);
    }

    function getOuvidoriaEnteNome(address ouvidoria) constant returns (string) {
        return toString(ouvidorias[ouvidoria].ente.nome);
    }

    // Uma ouvidoria cadastrada pode autorizar outra
    function autorizar(address ouvidoriaCandidata) {
        require(
            isOuvidoriaCadastrada(msg.sender) &&
            autorizadoraNuncaAutorizouCandidata(msg.sender, ouvidoriaCandidata)
        );
        ouvidoriasCandidatasComAutorizacoes[ouvidoriaCandidata].push(msg.sender);

        debug(msg.sender, "autorizar", autorizadoraNuncaAutorizouCandidata(msg.sender, ouvidoriaCandidata));
    }

    function isOuvidoriaCadastrada(address enderecoOuvidoria) constant returns (bool) {
        return ouvidorias[enderecoOuvidoria].existe;
    }

    function autorizadoraNuncaAutorizouCandidata(address ouvidoriaAutorizadora, address ouvidoriaCandidata) constant returns (bool) {
        var quemJahAutorizouEstaCandidata = ouvidoriasCandidatasComAutorizacoes[ouvidoriaCandidata];
        for (var i = 0; i < quemJahAutorizouEstaCandidata.length; i++) {
            if (quemJahAutorizouEstaCandidata[i] == ouvidoriaAutorizadora) {
                return false;
            }
        }
        return true;
    }

    // Uma ouvidoria com bastante votos pode cadastrar-se
    function cadastrar(bytes32 nome, uint8 tipoEnte, bytes32 nomeEnte, bytes32 endpoint) {
        // TODO mover logica do construtor para funcao interna dedicada e usa-la por aqui

        // verificar se msg.sender estah no array de votadas e se qtdVotos >= min(ouvidoriasCadastradas.length, 3)
        // caso nao tenha os votos, ERRO!
        // caso tenha, chamar funcao refatorada do TODO acima
    }

    // converte bytes32 em string
    function toString(bytes32 x) private constant returns (string) {
        bytes memory bytesString = new bytes(32);
        uint charCount = 0;
        for (uint j = 0; j < 32; j++) {
            byte char = byte(bytes32(uint(x) * 2 ** (8 * j)));
            if (char != 0) {
                bytesString[charCount] = char;
                charCount++;
            }
        }
        bytes memory bytesStringTrimmed = new bytes(charCount);
        for (j = 0; j < charCount; j++) {
            bytesStringTrimmed[j] = bytesString[j];
        }
        return string(bytesStringTrimmed);
    }

}
