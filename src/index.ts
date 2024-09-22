import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import { serverConfig, logger } from './config';
import { Todo, TodoList } from './types/todo.types';

const packageDefinition = protoLoader.loadSync('./todo.proto', {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const todoProto = grpc.loadPackageDefinition(packageDefinition).todoPackage as {
    TodoService: grpc.ServiceClientConstructor;
};

const client = new todoProto.TodoService(`127.0.0.1:${serverConfig.SERVER_PORT}`, grpc.credentials.createInsecure());

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/todos', (req: Request, res: Response) => {
    client.ListTodos({}, (error: grpc.ServiceError | null, response: TodoList) => {
        if (error) {
            logger.error(`Error fetching Todos: ${error.message}`);
            return res.status(500).send(error);
        }
        res.send(response.todos);
    });
});

app.post('/todos', (req: Request, res: Response) => {
    const newTodo: Todo = req.body;
    client.createTodo(newTodo, (error: grpc.ServiceError | null, response: Todo) => {
        if (error) {
            logger.error(`Error creating Todo: ${error.message}`);
            return res.status(500).send(error);
        }
        res.status(201).send(response);
    });
});

app.listen(serverConfig.PORT, () => {
    logger.info(`Client Server Started`);
});