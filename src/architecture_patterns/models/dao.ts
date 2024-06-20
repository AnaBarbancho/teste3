/* Basic Data access object design pattern 
**
** Author: Fabrício Galende M. de Carvalho 
** install: npm install @types/pg 
*/

import { Client } from 'pg';
import { createPool, Pool, PoolConnection } from 'mariadb';


interface UserDAO{
    insert_user(name:string, cpf:string):any;
}



class UserDAOPG implements UserDAO{
    //Database configuration
    dbConfig:Object = {
        user: 'postgres',
        host: 'localhost',
        database: 'uml',
        password: '123',
        port: 5432, // Replace by the port configured in your system
    }; 

    async insert_user(name: string, cpf: string){        
        /* function to connect to database and    
        perform a simple query */
        const client = new Client(this.dbConfig);
        let data={'nome': name, 'cpf':cpf};
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


class UserDAOMariaDB implements UserDAO {
    private pool: Pool;

    constructor() {
        this.pool = createPool({
            host: 'localhost',
            user: 'mariadb',
            password: '123',
            database: 'bd_aula',
            port: 3306
        });
    }

    async insert_user(nome: string, cpf: string): Promise<void> {
        let conn: PoolConnection | null = null;
        try {
            conn = await this.pool.getConnection();
            console.log('Conexão com o banco de dados MariaDB estabelecida com sucesso.');

            const query = 'INSERT INTO usuarios (nome, cpf) VALUES (?, ?)';
            const res = await conn.query(query, [nome, cpf]);
            console.log('Dados inseridos com sucesso no MariaDB', res);
        } catch (err) {
            console.error('Erro ao executar a query', err);
        } finally {
            if (conn) conn.release();
        }
    }
}



import { Db, MongoClient } from 'mongodb';

class UserDAOMongoDB implements UserDAO{
    async insert_user(name: string, cpf: string) {
        let client: MongoClient | null = null;
        client = await MongoClient.connect(this.url);
 
        const db = client.db('uml');
 
        const collection = db.collection('users');
 
        // Documento a ser inserido
        const userDocument = {
            name: name,
            cpf: cpf
        };
 
        // Inserir documento na coleção
        const result = await collection.insertOne(userDocument);
        console.log(`Documento inserido com sucesso: ${result.insertedId}`);
 
       
    }  
    url:string = 'mongodb://localhost:27017'; //database connection url
    dbName:string = 'uml'; //database name
 
    async listUser(users: string[]){
 
        let client: MongoClient | null = null;
   
            try {
            // Conectar ao servidor MongoDB
            client = await MongoClient.connect(this.url);
   
            console.log('Database MongoDB successfully connected. ');
            const db: Db = client.db(this.dbName);
            const collection = db.collection('users');
   
            // List all the users in collection
   
            const query = { /* your query criteria */ };
            const options = { /* optional: projection, sort, limit, etc. */ };
            const cursor = await collection.find(query, options);            
            const documents = await cursor.toArray();
            for(let i=0; i<documents.length; ++i){
                users.push(documents[i].nome);
            }            
        } catch (err) {
            console.error('Database connection error', err);
        } finally {
            if (client) {
            await client.close(); // Closes the connection
            console.log('Mongodb database connection closed');
            }
        }
        return users;
    }//list
}



export{
    UserDAO, UserDAOPG,UserDAOMariaDB,UserDAOMongoDB
}


