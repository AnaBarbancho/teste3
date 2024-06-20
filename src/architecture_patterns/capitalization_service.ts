/*
Basic string capitalization service
Autor: Fabrício G. M. de Carvalho, Ph.D
*/

/* Importing express framework */
import express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');
const app = express();

/* Each application must be executed in different ports if they are
at the same machine. */
const port = 5001;

/* Model import */
import {StringProcessor} from "./models/string_case";
import { logger } from './logger/log';  




/* Configuração para leitura de parâmetros em requisição do tipo post em form */
app.use(bodyParser.urlencoded({extended: false}));
/* Habilitação de requisições partindo de outras aplicações */
app.use(cors({
    oringin: '*',
    credentials: true
})); 

/* Service route creation . */
app.get('/capitalize', logRequestsMiddleware,capitalize_handler);
/* Server execution */
app.listen(port, listenHandler);


/* Request handlers: */
/* Capitalization service handler */
async function capitalize_handler(req:any, res:any){ 
    console.log("Capitalization request received"); //Only for debug
    let string_processor: StringProcessor = new StringProcessor();
    let str_input: string = req.query.str_in;
    let str_output: String = string_processor.capitalize(str_input);
    let str_output_json:Object = {'str_out': str_output};
    str_output_json = JSON.stringify(str_output_json);
    res.setHeader('Content-Type', 'application/json');
    res.end(str_output_json);     
}

export function listenHandler(){
    logger.info(`Capitalization service escutando na porta ${port}!`);
    console.log(`Listening port ${port}!`);
}
export function logRequestsMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
    // Log da requisição HTTP recebida
    logger.logHttpRequest(req.method, req.originalUrl, res.statusCode);
    next();
  }