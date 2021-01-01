import React from 'react';
// import { useStateValue } from "../state";
import { Field, Formik, Form } from "formik";
import { Grid, Button } from "semantic-ui-react";
import { HealthCheckFormValues } from "../types";
import { TextField, NumberField } from "./FormField";

interface Props {
  onCancel: () => void;
  onSubmit: (values: HealthCheckFormValues) => void;
}

export const AddHealthCheckEntryForm: React.FC<Props> = ({ onSubmit, onCancel }) => {
  //const [{ diagnoses }] = useStateValue();
  const min = 0;
  const max = 3;
  return (
    <Formik
      initialValues={{
        type: "HealthCheck",
        description: "",
        date: "",
        specialist: "",
        diagnosisCodes: undefined,
        healthCheckRating: 0
      }}
      onSubmit={onSubmit}
      validate={values => {
        const requiredError = "Field is required";
        const errors: { [field: string]: string } = {};
        if (!values.type) {
          errors.type = requiredError;
        }
        if (!values.description) {
          errors.description = requiredError;
        }
        if (!values.date) {
          errors.date = requiredError;
        } else if (!/^\d{4}-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])$/i.test(values.date)) {
          errors.date = 'Please input date in YYYY-MM-DD format';
        }
        if (!values.specialist) {
          errors.specialist = requiredError;
        }
        if (!values.healthCheckRating) {
          errors.healthCheckRating = requiredError;
        } else if (values.healthCheckRating < min || values.healthCheckRating > max) {
          errors.healthCheckRating =`Please insert number between ${min} and ${max}`;
        }
        return errors;

      }}
    >
    {({ isValid, dirty, /*setFieldValue, setFieldTouched*/ }) => {
      return (
        <Form className="form ui">
          <Field
            label="Description"
            placeholder="Description"
            name="description"
            component={TextField}
          />
          <Field
            label="Date"
            placeholder="YYYY-MM-DD"
            name="date"
            component={TextField}
          />
          <Field
            label="Specialist"
            placeholder="Specialist"
            name="specialist"
            component={TextField}
          />
          <Field
            label="Health Check Rating"
            name="healthCheckRating"
            component={NumberField}
            min={0}
            max={3}
            />
          <Grid>
            <Grid.Column floated="left" width={5}>
              <Button type="button" onClick={onCancel} color="red">
                Cancel
              </Button>
            </Grid.Column>
            <Grid.Column floated="right" width={5}>
              <Button
                type="submit"
                floated="right"
                color="green"
                disabled={!dirty || !isValid}
              >
                Add
              </Button>
            </Grid.Column>
          </Grid>
        </Form>
      );
    }}
    </Formik>
  );
};
