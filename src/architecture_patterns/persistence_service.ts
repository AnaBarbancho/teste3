import userController from "./controllers/userController";
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { logger } from "./logger/log";


const app = express();
const port = 5002;

// Configuração para ler dados de formulários
app.use(bodyParser.urlencoded({ extended: false }));

// Configuração do EJS como motor de visualização
app.set('view engine', 'ejs');
app.set('views', './src/views');

// Rota para o formulário de inserção de dados
app.get('/persist_form', (req: any, res: { render: (arg0: string) => void; }) => {
  res.render('database_insertion.ejs');
});

// Rota para persistir os dados no banco escolhido
app.post('/persist', userController.insertUser);

// Inicialização do servidor
app.listen(port, () => {
  logger.info(`Capitalization service escutando na porta ${port}!`);
  console.log(`Servidor rodando na porta ${port}`);
});
