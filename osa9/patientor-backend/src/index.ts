import express from 'express';
import diagnoseRouter from './routes/diagnoses';
import patientRouter from './routes/patients';
import cors = require('cors');
const app = express();
app.use(express.json());

const PORT = 3001;

app.use(cors());

app.get('/api/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

app.use('/api/diagnoses', diagnoseRouter);
app.use('/api/patients', patientRouter);
app.use('/api/patients/:id', patientRouter);
app.use('/api/patients/:id/entries', patientRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
