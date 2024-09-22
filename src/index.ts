import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

const packageDefinition = protoLoader.loadSync('./todo.proto', {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const todoProto = grpc.loadPackageDefinition(packageDefinition) as unknown as {
    todoPackage: {
        TodoService: grpc.ServiceClientConstructor;
    };
};

const client = new todoProto.todoPackage.TodoService('127.0.0.1:50051', grpc.credentials.createInsecure());

client.listTodos({}, (error: any, response: any) => {
    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Todos:', response);
        client.createTodo({ id: '4', title: 'new todo', content: '' }, (error: any, todo: any) => {
            if (error) {
                console.log('error', error);
                client.listTodos({}, (error: any, todos: any) => {
                    console.log('after insertion', todos);
                });
            } else {
                console.log('created new todo');
            }
        });
    }
});
