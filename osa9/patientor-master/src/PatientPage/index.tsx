import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { apiBaseUrl } from "../constants";
import { useStateValue, setPatient, setDiagnosisList } from "../state";
import { Icon, Button } from "semantic-ui-react";
import AddEntryModal from "../AddPatientModal/AddEntryModal";
import {
  Patient,
  Diagnosis,
  Entry,
  HealthCheckEntry,
  OccupationalHealthcareEntry,
  HospitalEntry,
  EntryFormValues } from "../types";

interface EntryListProps {
    entries: Entry[];
    diagnoses: { [code: string]: Diagnosis };
}

interface EntryDetailsProps {
    entry: Entry;
    diagnoses: { [code: string]: Diagnosis };
}

interface HealthCheckEntryDetailsProps {
    entry: HealthCheckEntry;
    diagnoses: { [code: string]: Diagnosis };
}

interface OccupationalHealthcareDetailsProps {
    entry: OccupationalHealthcareEntry;
    diagnoses: { [code: string]: Diagnosis };
}

interface HospitalEntryDetailsProps {
    entry: HospitalEntry;
    diagnoses: { [code: string]: Diagnosis };
}

const EntryList: React.FC<EntryListProps> = ({ entries, diagnoses }: EntryListProps) => {
  return (
    <div>
      <h2>Entries: </h2>
      {entries.map(entry => {
        if(!entry) return null;

        return(
          <EntryDetails key={entry.id} entry={entry} diagnoses={diagnoses} />
        );
      })
    }
    </div>
  );
};

const divStyle = {
  padding:'10px',
  margin: '0 0 6px 0',
  border:'solid 1px gray'
};

const HospitalEntryDetails: React.FC<HospitalEntryDetailsProps> = ({ entry, diagnoses }) => {
  const hospitalIcon = <Icon name='plus square' size='large' />;
  return(
    <div style={divStyle}>
    <h2>{entry.date} {hospitalIcon} Hospital Entry</h2>
    {entry.description}
      <ul>
       {entry.diagnosisCodes != null &&
         entry.diagnosisCodes.map(code => {

           if(!code || diagnoses[code] !== undefined) {
             return (
               <li key={code}>{code} {diagnoses[code].name}</li>
             );
           } else { return null; }
         })
       }
      </ul>
      { entry.discharge != null &&
        <div>
          <b>Discaharge:</b><br />
          Date: {entry.discharge.date}<br />
          Criteria: {entry.discharge.criteria}
        </div>
      }
    </div>
  );
};

const OccupationalHealthcareEntryDetails: React.FC<OccupationalHealthcareDetailsProps> = ({ entry, diagnoses }) => {
  const occupationalIcon = <Icon name='stethoscope' size='large' />;
  return(
    <div style={divStyle}>
      <h2>{entry.date} {occupationalIcon} {entry.employerName}, Occupational Healthcare Check</h2>
      <p>{entry.description}</p>
      <ul>
       {entry.diagnosisCodes != null &&
         entry.diagnosisCodes.map(code => {

           if(!code || diagnoses[code] !== undefined) {
             return (
               <li key={code}>{code} {diagnoses[code].name}</li>
             );
           } else { return null; }
         })
       }
      </ul>
      {entry.sickLeave != null &&
        <div><b>Sick Leave:</b><br />
        Start: {entry.sickLeave.startDate} <br />
        End: {entry.sickLeave.endDate}</div>
      }
    </div>
  );
};

const HealthCheckEntryDetails: React.FC<HealthCheckEntryDetailsProps> = ({ entry, diagnoses }) => {
  const healthCheckIcon = <Icon name='doctor' size='large' />;
  const healthRatingIcon =
    (entry.healthCheckRating === 0) ? <div><Icon bordered inverted name='heart' color='green' /> Healthy</div>:
    (entry.healthCheckRating === 1) ? <div><Icon bordered inverted name='heart' color='yellow' /> Low Risk</div>:
    (entry.healthCheckRating === 2) ? <div><Icon bordered inverted name='heart' color='red' /> High Risk</div>:
    <div><Icon bordered inverted name='heart' color='black' /> Critical</div>;
  return(
    <div style={divStyle}>
      <h2>{entry.date} {healthCheckIcon} Health Check</h2>
      <p>{entry.description}</p>
      {healthRatingIcon}
      <ul>
       {entry.diagnosisCodes != null &&
         entry.diagnosisCodes.map(code => {

           if(!code || diagnoses[code] !== undefined) {
             return (
               <li key={code}>{code} {diagnoses[code].name}</li>
             );
           } else { return null; }
         })
       }
      </ul>
    </div>
  );
};

// Helper function for exhaustive type checking
const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const EntryDetails: React.FC<EntryDetailsProps> = ({ entry, diagnoses }: EntryDetailsProps) => {
  switch(entry.type) {
    case "Hospital":
      return <HospitalEntryDetails entry={entry} diagnoses={diagnoses}/>;
    case "OccupationalHealthcare":
      return <OccupationalHealthcareEntryDetails entry={entry} diagnoses={diagnoses}/>;
    case "HealthCheck":
      return <HealthCheckEntryDetails entry={entry} diagnoses={diagnoses}/>;
    default:
      return assertNever(entry);
  }
};

const PatientPage = () => {
  const { id } = useParams<{ id: string }>();
  // ei päivitä sivua?!?!
  const [{ activePatient, diagnoses }, dispatch] = useStateValue();
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | undefined>();

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  React.useEffect(() => {
    if(activePatient !== undefined && activePatient.id === id) {
      return;
    }

    const fetchPatient = async () => {
      try {
        const {data: patientFromApi } = await axios.get<Patient>(
          `${apiBaseUrl}/patients/${id}`
        );
        dispatch(setPatient(patientFromApi));
      } catch (e) {
        console.error(e);
      }
    };
    fetchPatient();

    const fetchDiagnosisList = async () => {
      try {
        const { data: diagnosisListFromApi } = await axios.get<Diagnosis[]>(
          `${apiBaseUrl}/diagnoses`
        );
        dispatch(setDiagnosisList(diagnosisListFromApi));
      } catch (e) {
        console.error(e);
      }
    };
    fetchDiagnosisList();
  }, [dispatch, id, activePatient]);

  const submitNewEntry = async (values: EntryFormValues) => {
    console.log('SUBMIT: '+ values.type +' '+ values.description +' '+ values.diagnosisCodes);
    try {
      const { data: patientFromApi } = await axios.post<Patient>(
        `${apiBaseUrl}/patients/${id}/entries`,
        values
      );
      dispatch(setPatient(patientFromApi));
      closeModal();
    } catch (e) {
      console.error(e.response.data);
      setError(e.response.data.error);
    }
  };

  if(activePatient !== undefined) {
    const genderIcon =
     ( activePatient.gender === 'male') ? <Icon name='man' /> :
     ( activePatient.gender === 'female') ? <Icon name='woman' /> :
     <Icon name='other gender horizontal' />;

    return (
      <div>
        <h1>{genderIcon} {activePatient.name}</h1>
        <div><b>Occupation:</b> { activePatient.occupation }</div>
        <div><b>Gender:</b> { activePatient.gender }</div>
        <div><b>ssn:</b> {activePatient.ssn}</div>
        <div><b>Date of birth:</b> {activePatient.dateOfBirth}</div>
        <br />
        { (activePatient.entries != null && activePatient.entries.length > 0)&&
            <EntryList entries={activePatient.entries} diagnoses={diagnoses} />
        }
        <AddEntryModal
          modalOpen={modalOpen}
          onSubmit={submitNewEntry}
          error={error}
          onClose={closeModal}
        />
        <Button onClick={() => openModal()}>Add New Entry</Button>
      </div>
    );
  } else {
    return (
      <div>
        Patient id: { id } <br />
        was not found!
      </div>
    );
  }
};

export default PatientPage;
