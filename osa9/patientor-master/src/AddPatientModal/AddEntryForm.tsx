import React from "react";
import { Formik, Form } from "formik";
import { AddHospitalEntryForm } from "./AddHospitalEntryForm";
import { AddOccupationalEntryForm } from "./AddOccupationalEntryForm";
import { AddHealthCheckEntryForm } from "./AddHealthCheckEntry";
import { EntryOption, SelectEntryField } from "./FormField";
import { EntryFormValues } from "../types";

interface Props {
  onSubmit: (values: EntryFormValues) => void;
  onCancel: () => void;
}

export const AddEntryForm: React.FC<Props> = ({ onSubmit, onCancel }) => {
  /*const [{ diagnoses }] = useStateValue();*/
  const [type, setType] = React.useState<string>('Hospital');
  const entryOptions: EntryOption[] = [
    { value: 'Hospital', label: "Hospital Entry" },
    { value: 'OccupationalHealthcare', label: "Occupational Healthcare Entry" },
    { value: 'HealthCheck', label: "Health Check Entry" }
  ];

  /* (e: React.ChangeEvent<any>) => void */
  const onChange = (e: React.ChangeEvent<any>) => {
    setType(e.target.value);
  };

  return (
    <div>
      <Formik
        initialValues={{ email: '', password: '' }}
        onSubmit={() => {} }
      >
        <Form className="form ui">
          <SelectEntryField
            label="Entry type"
            name="Entry"
            options={entryOptions}
            onChange={onChange}
          />
        </Form>
      </Formik>

      { (type === 'Hospital') &&
        <AddHospitalEntryForm onSubmit={onSubmit} onCancel={onCancel} />
      }
      {
        (type === 'OccupationalHealthcare') &&
        <AddOccupationalEntryForm onSubmit={onSubmit} onCancel={onCancel} />
      }
      {
        (type === 'HealthCheck') &&
        <AddHealthCheckEntryForm onSubmit={onSubmit} onCancel={onCancel} />
      }
    </div>
  );
};

export default AddEntryForm;
