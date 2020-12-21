import diagnoseData from '../data/diagnoses';
import {
  DischargeEntry,
  SickLeaveEntry,
  HealthCheckRating,
  NewDiagnoseEntry,
  NewHospitalEntry,
  NewOccupationalHealthcareEntry,
  NewHealthCheckEntry,
  Diagnosis } from './types';

/* eslint-disable @typescript-eslint/no-explicit-any,
  @typescript-eslint/restrict-plus-operands,
  @typescript-eslint/no-unsafe-member-access */
const toNewDiagnoseEntry = (object: any): NewHospitalEntry | NewOccupationalHealthcareEntry | NewHealthCheckEntry => {
  let newEntry;
  switch(object.type) {
    case "Hospital":
      newEntry = buildBase(object) as NewHospitalEntry;
      if(object.discharge && (object.discharge.date !== '' && object.discharge.criteria !== '')) {
        const discharge: DischargeEntry = parseDischarge(object.discharge);
        return {...newEntry, discharge};
      }

      return {...newEntry};
    case "OccupationalHealthcare":
      newEntry = buildBase(object) as NewOccupationalHealthcareEntry;
      const employerName = parseEmployerName(object.employerName);
      if(object.sickLeave) {
        const sickLeave: SickLeaveEntry = parseSickLeave(object.sickLeave);
        return {...newEntry, employerName, sickLeave};
      }

      return {...newEntry, employerName};
    case "HealthCheck":
      newEntry = buildBase(object) as NewHealthCheckEntry;
      const healthCheckRating = parseHealthCheckRating(object.healthCheckRating);
      console.log('healthCheckRating: '+ healthCheckRating);
      return {...newEntry, healthCheckRating};
    default:
      throw new Error('Wrong diagnose type');
  }

};

const buildBase = (object: any): NewDiagnoseEntry => {
  return {
    type: parseType(object.type),
    description: parseDescripton(object.description),
    date: parseDate(object.date),
    specialist: parseSpecialist(object.specialist),
    diagnosisCodes: parseDiagnosisCodes(object.diagnosisCodes),
  };
};

const isString = (text: any): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isDischarge = (discharge: any): discharge is DischargeEntry => {
  return typeof discharge.date === 'string' && typeof discharge.criteria === 'string';
};

const isSickLeave = (sickLeave: any): sickLeave is SickLeaveEntry => {
  return typeof sickLeave.startDate === 'string' && typeof sickLeave.endDate === 'string';
};

const isHealthCheckRating = (rating: any): rating is HealthCheckRating => {
  return Object.values(HealthCheckRating).includes(rating);
};

const includesEvery = (codes: any): boolean => {
  const diagnoseCodes: Array<string> = [];
  diagnoseData.forEach( el => {
    diagnoseCodes.push(el.code);
  });

  if(Array.isArray(codes)) {
    return codes.every( c => diagnoseCodes.includes(c));
  }

  return false;
};

const isDiagnosisCodes = (codes: any): codes is Array<Diagnosis['code']> => {
  return includesEvery(codes);
};

const parseDiagnosisCodes = (codes: any): Array<Diagnosis['code']> => {
  if (!codes || !isDiagnosisCodes(codes)) {
      throw new Error('Incorrect or missing diagnosisCodes: '+ codes);
  }
  return codes;
};

const parseEmployerName = (name: any): string => {
  if(!name || !isString(name)) {
    throw new Error('Incorrect or missing employerName:'+ name);
  }

  return name;
};

const parseType = (type: any): string => {
  if(!type || !isString(type)) {
    throw new Error('Incorrect or missing type:'+ type);
  }

  return type;
};

const parseDescripton = (description: any): string => {
  if(!description || !isString(description)) {
    throw new Error('Incorrect or missing description:'+ description);
  }
  return description;
};

const parseDate = (date: any): string => {
  if(!date || !isString(date)) {
    throw new Error('Incorrect or missing date:'+ date);
  }
  return date;
};

const parseSpecialist = (specialist: any): string => {
  if(!specialist || !isString(specialist)) {
    throw new Error('Incorrect or missing specialist:'+ specialist);
  }
  return specialist;
};

const parseDischarge = (discharge: any): DischargeEntry => {
  if(!discharge || !isDischarge(discharge)) {
    throw new Error('Incorrect or missing discharge:'+ discharge);
  }
  return discharge;
};

const parseSickLeave = (sickLeave: any): SickLeaveEntry => {
  if(!sickLeave || !isSickLeave(sickLeave)) {
    throw new Error('Incorrect or missing sickLeave:'+ sickLeave);
  }
  return sickLeave;
};

const parseHealthCheckRating = (rating: any): HealthCheckRating => {
  if(!rating || !isHealthCheckRating(rating)) {
    throw new Error('Incorrect or missing healthCheckRating:'+ rating);
  }
  return rating;
};

export default toNewDiagnoseEntry;
