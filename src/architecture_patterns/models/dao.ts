/* Basic Data access object design pattern 
**
** Author: Fabrício Galende M. de Carvalho 
** install: npm install @types/pg 
*/

import { Client } from 'pg';
import { createPool, Pool } from 'mariadb';


interface UserDAO{
    insert_user(name:string, cpf:string):any;
}



class UserDAOPG implements UserDAO{
    //Database configuration
    dbConfig:Object = {
        user: 'postgres',
        host: 'localhost',
        database: 'uml',
        password: 'root',
        port: 3309, // Replace by the port configured in your system
    }; 

    async insert_user(nome: string, cpf: string){        
        /* function to connect to database and    
        perform a simple query */
        const client = new Client(this.dbConfig);
        let data={'nome': nome, 'cpf':cpf};
        console.log(data); //debug only
         await client.connect();
         console.log('Database successfully connected.');
         // Executing a query 
         const insertQuery = 'INSERT INTO usuario(nome, cpf) VALUES ($1, $2)';
          client.query(insertQuery, [data.nome, data.cpf])
                .then(result => {
                    console.log('Data inserted successfully');                    
                })
                .catch(error => {
                    console.error('Error executing query', error);                    
                })
                .finally(() => {
                    console.log("connection closed");
                    client.end();                   
                });                            
                 
    }
}


class UserDAOMariaDB {
    private pool: Pool;

    constructor() {
        this.pool = createPool({
            host: 'localhost',
            user: 'your_user',
            password: 'your_password',
            database: 'your_database',
            port: 3306 // substitua pela porta configurada no seu sistema
        });
    }

    async insertUser(nome: string, cpf: string) {
        let conn;
        try {
            conn = await this.pool.getConnection();
            console.log('Database successfully connected.');

            const query = 'INSERT INTO usuario (nome, cpf) VALUES (?, ?)';
            const res = await conn.query(query, [nome, cpf]);
            console.log('Data inserted successfully', res);
        } catch (err) {
            console.error('Error executing query', err);
        } finally {
            if (conn) conn.end();
        }
    }
}
import { MongoClient } from 'mongodb';

class UserDAOMongoDB {
    private client: MongoClient;
    private dbName: string = 'your_database';

    constructor() {
        this.client = new MongoClient('mongodb://localhost:27017');
    }

    async insertUser(nome: string, cpf: string) {
        try {
            await this.client.connect();
            console.log('Database successfully connected.');

            const db = this.client.db(this.dbName);
            const collection = db.collection('usuario');

            const result = await collection.insertOne({ nome, cpf });
            console.log('Data inserted successfully', result);
        } catch (err) {
            console.error('Error executing query', err);
        } finally {
            await this.client.close();
        }
    }
}



export{
    UserDAO, UserDAOPG,UserDAOMariaDB,UserDAOMongoDB
}


