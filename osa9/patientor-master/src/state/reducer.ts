import { State } from "./state";
import { Patient, Diagnosis, Entry } from "../types";

export type Action =
  | {
      type: "SET_PATIENT_LIST";
      payload: Patient[];
    }
  | {
      type: "SET_PATIENT";
      payload: Patient;
    }
  | {
      type: "ADD_PATIENT";
      payload: Patient;
    }
  | {
    type: "SET_DIAGNOSIS_LIST";
    payload: Diagnosis[];
  }
  | {
    type: "ADD_DIAGNOSIS";
    payload: Diagnosis;
  }
  | {
    type: "ADD_ENTRY";
    payload: Entry;
  };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_PATIENT_LIST":
      return {
        ...state,
        patients: {
          ...action.payload.reduce(
            (memo, patient) => ({ ...memo, [patient.id]: patient }),
            {}
          ),
          ...state.patients
        }
      };
    case "SET_DIAGNOSIS_LIST":
      return {
        ...state,
        diagnoses: {
          ...action.payload.reduce(
            (memo, diagnosis) => ({ ...memo, [diagnosis.code]: diagnosis }),
            {}
          ),
          ...state.diagnoses
        }
      };
    case "SET_PATIENT":
      return {
        ...state,
        activePatient: action.payload
      };
    case "ADD_PATIENT":
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload
        }
      };
    case "ADD_DIAGNOSIS":
    return {
      ...state,
      diagnoses: {
        ...state.diagnoses,
        [action.payload.code]: action.payload
      }
    };
    case "ADD_ENTRY":
      if(state.activePatient === undefined) {
        return {...state};
      }

      console.log('state.activePatient.id: '+ state.activePatient.id +' payload id: '+ action.payload.id);
      return {
        ...state,
        activePatient: {
          ...state.activePatient,
          [action.payload.id]: action.payload // tässä on virhe?
        }
      };
    default:
      return state;
  }
};
