import { v4 as uuidv4 } from 'uuid';
import patientData from '../../data/patients';
import { NonSensitivePatientEntry,
  Patient,
  Entry,
  NewPatientEntry,
  NewEntry,
} from '../types';

let patients: Array<Patient> = patientData;

const getEntries = (): Array<Patient> => {
  return patients;
};

const getEntry = (patientId: string): Patient => {
  const patient = patients.find( ({ id }) => id === patientId);
  if(patient === undefined) {
    throw new Error('patient not found');
  }
  return patient;
};

const getNonSensitiveEntries = (): NonSensitivePatientEntry[] => {
  return patients.map(({ id, name, occupation, gender, dateOfBirth, entries }) => ({
    id,
    name,
    occupation,
    gender,
    dateOfBirth,
    entries,
  }));
};

const addPatientEntry = ( entry: NewPatientEntry ): Patient => {
  const newPatientEntry = {
    id: uuidv4(), ...entry
  };

  patients.push(newPatientEntry);
  return newPatientEntry;
};

const addDiagnoseEntry = ( entry: NewEntry, patientId: string ): Entry => {
  const newDiagnoseEntry: Entry = {
    id: uuidv4(), ...entry
  };

  const updatedPatient = getEntry(patientId);
  updatedPatient.entries.push(newDiagnoseEntry);
  patients = patients.map( p =>
    p.id === patientId ? updatedPatient : p
  );
  console.log(patients);
  return newDiagnoseEntry;
};

export default {
  getEntries,
  getEntry,
  addPatientEntry,
  addDiagnoseEntry,
  getNonSensitiveEntries
};
