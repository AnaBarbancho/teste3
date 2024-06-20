/*
Basic client app example.
Author: Fabrício G. M. de Carvalho, DSc.
*/
import { Request, Response } from 'express';

/* express web framework */
const express = require('express')

/* component to read body requests from forms */
const bodyParser = require('body-parser');

/* module to generate requests to service gateway */
var axios = require('axios');
import { AxiosResponse, AxiosError } from "axios";
import { UserDAOMariaDB, UserDAOMongoDB, UserDAOPG } from './models/dao';
import { logger } from './logger/log';

const app = express();
const port = 5003;



/* Template engine configuration */
app.set('view engine', 'ejs');
app.set('views', './views'); //This reference is from the execution point

/* Configuration to read post request parameters */
app.use(bodyParser.urlencoded({extended: false}));

app.post('/persist', async (req: { body: { nature:any,description:any, name: any; cpf: any; database: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: string): void; new(): any; }; }; send: (arg0: string) => void; }) => {
    const {nature,description, name, cpf, database } = req.body;

    if (!nature || !description || !name || !cpf || !database) {
        logger.error("Campos obrigatórios faltando na requisição de persistência");
        res.status(400).send("Missing required fields");
        return;
    }

    try {
        let userDAO;
        
        // Escolha do DAO com base no banco de dados selecionado
        if (database === 'postgres') {
            userDAO = new UserDAOPG(); // Instância para interação com PostgreSQL
        } else if (database === 'mongodb') {
            userDAO = new UserDAOMongoDB(); // Instância para interação com MongoDB
        } else if (database === 'mariadb') {
            userDAO = new UserDAOMariaDB(); // Instância para interação com MariaDB
        } else {
            logger.error("Seleção de banco de dados inválida na requisição de persistência");
            res.status(400).send("Invalid database selection");
            return;
        }

        // Chamada ao método de inserção de usuário do DAO escolhido
        await userDAO.insert_user(nature,description,name, cpf);
        logger.info(`Dados inseridos com sucesso no banco ${database}:${nature},${description}, ${name}, ${cpf}`);
        res.send("Dados inseridos com sucesso");
    } catch (error) {
        logger.error("Erro ao persistir dados: " + error);
        console.error("Erro ao persistir dados:", error);
        res.status(500).send("Erro ao persistir dados");
    }
});
app.post('/list-calls', async (req: Request, res: Response) => {
    try {
        // Inicializa arrays para armazenar resultados de cada banco de dados
        let callsFromPG: any[] = [];
        let callsFromMongo: any[] = [];
        let callsFromMaria: any[] = [];

        // Fetch chamados do PostgreSQL
        const pgDAO = new UserDAOPG();
        callsFromPG = await pgDAO.getAllCalls();

        // Fetch chamados do MongoDB
        const mongoDAO = new UserDAOMongoDB();
        callsFromMongo = await mongoDAO.getAllCalls();

        // Fetch chamados do MariaDB
        const mariaDAO = new UserDAOMariaDB();
        callsFromMaria = await mariaDAO.getAllCalls();

        // Combina todos os resultados
        const allCalls = {
            postgres: callsFromPG,
            mongodb: callsFromMongo,
            mariadb: callsFromMaria
        };

        // Renderiza a página list_calls.ejs com os dados dos chamados
        res.render('list_calls', {
            natureza: 'natureza', // Substitua pelos valores reais aqui
            descricao: 'descricao',
            name: 'nome',
            cpf: 'cpf',
            calls: allCalls
        });
    } catch (error) {
        logger.error(`Erro ao buscar chamados nos bancos de dados: ${error}`);
        res.status(500).send("Erro ao buscar chamados nos bancos de dados");
    }
});


/* Static files directory configuration .*/
app.use(express.static('src/public'));

//app.get('/addForm', addProjectHandlerForm);

app.post('/capitalize', capitalize_text_handler);
app.post('/persist', persist_name_handler);
app.get('/', root_client_handler);
app.get('/persist_form', persist_client_handler);
app.post('/list-calls',)
app.listen(port, listenHandler);


/* Function to return text capitalization interface */
function root_client_handler(req:any,res:any){
    res.render('text_capitalization.ejs'); 
}

/* Function to return text persistence interface */
function persist_client_handler(req:any,res:any){
    res.render('database_insertion.ejs'); 
}
function persist(req:any,res:any){
    
}
/* function to perform text capitalization through web service */
async function capitalize_text_handler(req:any,res:any){
    let input_text = req.body.text_input;
    console.log(input_text);
    let url = 'http://localhost:5000/capitalization?str_in='+input_text;
    axios.get(url)
            .then((response: AxiosResponse) => {
                res.render('response.ejs', {service_response: response.data.str_out})
                // Handle successful response
                console.log('Response status:', response.status);
                console.log('Response data:', response.data);
            })
            .catch((error: AxiosError) => {
                // Handle error
                if (error.response) {
                // Server responded with some error status code
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
                console.error('Response headers:', error.response.headers);
                } else if (error.request) {
                // no response was sent
                console.error('Request:', error.request);
                } else {
                // Some processing error
                console.error('Error:', error.message);
                }
            });   
    
}

/* function to perform text capitalization through web service */
async function persist_name_handler(req:any,res:any){
    let natureza = req.body.nature;
    let descricao = req.body.description;
    let name = req.body.name;
    let cpf = req.body.cpf;
    console.log(natureza)
    console.log(descricao)
    console.log(name);
    console.log(cpf);
    let url = 'http://localhost:5000/persistence?&natureza='+natureza+'&descricao='+descricao+'&nome='+name+'&cpf='+cpf;
    axios.get(url)
            .then((response: AxiosResponse) => {
                res.render('response.ejs', {service_response: response.data})
                // Handle successful response
                console.log('Response status:', response.status);
                console.log('Response data:', response.data);
            })
            .catch((error: AxiosError) => {
                // Handle error
                if (error.response) {
                // Server responded with some error status code
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
                console.error('Response headers:', error.response.headers);
                } else if (error.request) {
                // no response was sent
                console.error('Request:', error.request);
                } else {
                // Some processing error
                console.error('Error:', error.message);
                }
            });   
}


/* Tratador para inicializar a aplicação (escutar as requisições)*/
function listenHandler(){
    logger.info(`Servidor iniciado na porta ${port}`);
    console.log(`Escutando na porta ${port}!`);
}


export{}