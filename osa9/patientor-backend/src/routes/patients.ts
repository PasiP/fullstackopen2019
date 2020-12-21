import express from 'express';
import toNewPatientEntry from '../patientUtils';
import toNewDiagnoseEntry from '../diagnoseUtils';
import patientService from '../services/patientService';

const router = express.Router();

router.get('/', (_req, res) => {
  res.send(patientService.getNonSensitiveEntries());
});

router.get('/:id', (_req, res) => {
  const patientId = _req.params.id;
  res.send(patientService.getEntry( patientId ));
});

router.post('/', (req, res) => {
  try {
    const newPatientEntry = toNewPatientEntry(req.body);

    const addedEntry = patientService.addPatientEntry(newPatientEntry);
    res.json(addedEntry);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post('/:id/entries', (_req, res) => {
  try {
    console.log(_req.body);
    const newDiagnoseEntry = toNewDiagnoseEntry(_req.body);
    const patientId = _req.params.id;
    console.log(newDiagnoseEntry);

    const addedEntry = patientService.addDiagnoseEntry(newDiagnoseEntry, patientId);
    res.json(addedEntry);
  } catch (e) {
    res.status(400).send(e);
    console.log(e);
  }
});

export default router;
