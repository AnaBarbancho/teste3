// userController.ts

import { Request, Response } from 'express';
import { UserDAOMariaDB, UserDAOMongoDB, UserDAOPG } from '../models/dao';


class UserController {
  public async insertUser(req: Request, res: Response): Promise<void> {
    const { name, cpf, database } = req.body;

    if (!name || !cpf || !database) {
      res.status(400).send('Missing required fields');
      return;
    }

    try {
      let userDAO;

      switch (database) {
        case 'postgres':
          userDAO = new UserDAOPG();
          break;
        case 'mongodb':
          userDAO = new UserDAOMongoDB();
          break;
        case 'mariadb':
          userDAO = new UserDAOMariaDB();
          break;
        default:
          res.status(400).send('Invalid database selection');
          return;
      }

      await userDAO.insert_user(name, cpf);
      res.render('response.ejs', { service_response: 'Dados inseridos com sucesso' });
    } catch (error) {
      console.error('Erro ao persistir dados:', error);
      res.status(500).send('Erro ao persistir dados');
    }
  }
}

export default new UserController();
