/*
/*
Basic Data Persistence Service
Autor: Fabrício G. M. de Carvalho, Ph.D
*/

/* Importing express framework */
const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');
const app = express();

/* Each application must be executed in different ports if they are
at the same machine. */
const port = 5002;

/* Persistence class models */
import {UserDAO, UserDAOPG,UserDAOMariaDB,UserDAOMongoDB} from "./models/dao";



/* Configuração para leitura de parâmetros em requisição do tipo post em form */
app.use(bodyParser.urlencoded({extended: false}));
/* Habilitação de requisições partindo de outras aplicações */
app.use(cors({
    oringin: '*',
    credentials: true
})); 

/* Service route creation . */
app.get('/persist', persistence_handler);
/* Server execution */
app.listen(port, listenHandler);

function listenHandler(){
    console.log(`Listening port ${port}!`);
}


/* Request handlers: */
/* Persistence Service Handler */
async function persistence_handler(req: any, res: any) {
    console.log("Requisição de serviço de persistência recebida");

    let nome: string = req.query.nome;
    let cpf: string = req.query.cpf;

    let user_dao: UserDAO;

    // Escolha do DAO baseado no banco de dados desejado (exemplo hipotético)
    const dbType = req.query.dbType; // Suponha que você tenha uma forma de determinar o tipo de banco de dados

    if (dbType === 'MariaDB') {
        user_dao = new UserDAOMariaDB();
    } else if (dbType === 'MongoDB') {
        user_dao = new UserDAOMongoDB();
    } else {
        user_dao = new UserDAOPG();
    }

    await user_dao.insert_user(nome, cpf);

    res.end("Dados inseridos com sucesso");
}