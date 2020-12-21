import express from 'express';
import { calculateBmi } from './bmiCalculator';

interface Values {
  value1: number;
  value2: number;
}

const parseArgs = (req: express.Request): Values => {
  let height;
  let weight;

  if (req.query && req.query.height && req.query.weight) {
    height = String(req.query.height);
    weight = String(req.query.weight);
   } else {
     throw new Error('malformatted parameters');
   }

  if (!isNaN(Number(height)) && !isNaN(Number(weight))) {
    return {
      value1: Number(height),
      value2: Number(weight)
    };
  } else {
    throw new Error('Provided values were not numbers!');
  }
};

const app = express();


app.get('/', (_req, res) => {
  res.send('Hello Full Stack!!!');
});

app.set('query parser', 'simple')
  .get('/bmi', (_req, res, _next) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const {value1, value2} = parseArgs(_req);
    const result = {
      height: value1,
      weight: value2,
      bmi: calculateBmi(value1, value2)
    };
    res.send(result);
  })
  .use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err.stack);
    res.status(400).send({error: err.message});
  });


const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
