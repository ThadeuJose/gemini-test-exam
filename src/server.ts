import express, { Request, Response } from 'express';
import { execute } from './llm';

const app = express();
const port = 3000;

app.get('/', (req: Request, res: Response) => {
  execute();
  res.send('Hello, TypeScript and Express!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
