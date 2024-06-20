/* Basic Data access object design pattern 
**
** Author: Fabrício Galende M. de Carvalho 
** install: npm install @types/pg 
*/

import { Db, MongoClient } from 'mongodb';
import { Client} from 'pg';
import { createPool, Pool, PoolConnection } from 'mariadb';
import { logger } from '../logger/log';


interface UserDAO{
    insert_user(nature:string,description:string,name:string, cpf:string):any;
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

    async insert_user(natureza:string,descricao:string,nome: string, cpf: string){        
        /* function to connect to database and    
        perform a simple query */
        const client = new Client(this.dbConfig);
        let data={'natureza':natureza,'descricao':descricao,'nome': nome, 'cpf':cpf};
        console.log(data); //debug only
         await client.connect();
         console.log('Database successfully connected.');
         // Executing a query 
         const insertQuery = 'INSERT INTO usuario(natureza,descricao,nome, cpf) VALUES ($1, $2, $3, $4)';
          client.query(insertQuery, [data.natureza,data.descricao,data.nome, data.cpf])
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
    async getAllCalls(): Promise<any[]> {
        const client = new Client(this.dbConfig);
        await client.connect();

        const query = 'SELECT * FROM usuario';
        const result = await client.query(query);
        const calls = result.rows;

        await client.end();
        return calls;
    }
}


class UserDAOMongoDB implements UserDAO{

    async insert_user(nature:string,description:string,name: string, cpf: string) {
        let client: MongoClient | null = null;
        client = await MongoClient.connect(this.url);

        const db = client.db('uml');

        const collection = db.collection('users');

        // Documento a ser inserido
        const userDocument = {
            natureza:nature,
            descricao:description,
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
    async getAllCalls(): Promise<any[]> {
        const client = await MongoClient.connect(this.url);
        const db = client.db(this.dbName);
        const collection = db.collection('users');

        const calls = await collection.find({}).toArray();

        await client.close();
        return calls;
    }
}


class UserDAOMariaDB {
    private pool: Pool;

    constructor() {
        this.pool = createPool({
            host: 'localhost',
            user: 'root',
            password: '123',
            database: 'uml',
            port: 3306,
            connectionLimit: 5
        });
    }

    async insert_user(natureza:string,descricao:string,nome: string, cpf: string): Promise<void> {
        let conn: PoolConnection | null = null;
        try {
            conn = await this.pool.getConnection();
            console.log('Conexão com o banco de dados MariaDB estabelecida com sucesso.');

            const query = 'INSERT INTO users (natureza,descricao,nome, cpf) VALUES (?, ?, ?, ?)';
            const res = await conn.query(query, [natureza,descricao,nome, cpf]);
            console.log('Dados inseridos com sucesso no MariaDB', res);
        } catch (err) {
            console.error('Erro ao executar a query', err);
            throw err; // Re-throw para que o erro seja tratado no endpoint
        } finally {
            if (conn) conn.release();
        }
    }
    async getAllCalls(): Promise<any[]> {
        let conn: PoolConnection | null = null;
        try {
            conn = await this.pool.getConnection();
            const query = 'SELECT * FROM users';
            const result = await conn.query(query);
            return result[0]; // Resultado da consulta está na primeira posição do array
        } catch (err) {
            logger.error(`Erro ao buscar chamados no MariaDB: ${err}`);
            throw err;
        } finally {
            if (conn) conn.release();
        }
    }
}

export{
    UserDAO, UserDAOPG, UserDAOMongoDB, UserDAOMariaDB
}




