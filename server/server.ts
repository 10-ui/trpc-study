import express from 'express';
import { initTRPC } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import cors from 'cors';
import { z } from 'zod';

const app = express();
const port = 5000;
app.use(cors());

// app.get('/', (req, res) => {
//   res.send('Hello');
// });

const t = initTRPC.create();
const router = t.router;
const publicProcedure = t.procedure;

interface Todo {
  id: string;
  content: string;
}

const todoList: Todo[] = [
  { id: '1', content: '散歩' },
  { id: '2', content: 'プログラミング' },
  { id: '3', content: '10-ui' },
];

//値の取得
// publicProcedure.query();
//値の操作
// publicProcedure.mutation();

const appRouter = router({
  test: publicProcedure.query(() => {
    return 'TEST TRPC';
  }),
  getTodos: publicProcedure.query(() => {
    return todoList;
  }),
  addTodo: publicProcedure
    .input(z.string())
    .mutation((req) => {
      const id = `${Math.random()}`;
      const todo: Todo = {
        id,
        content: req.input,
      };
      todoList.push(todo);
      return todoList;
    }),
  deleteTodo: publicProcedure
    .input(z.string())
    .mutation((req) => {
      const idTodoDelete = req.input;
      const indexTodoDelete = todoList.findIndex(
        (todo) => todo.id === idTodoDelete
      );

      todoList.splice(indexTodoDelete, 1);
      return todoList;
    }),
});

app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
  })
);

app.listen(port);

export type AppRouter = typeof appRouter;
