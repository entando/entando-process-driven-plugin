import React from 'react';
import Typography from '@material-ui/core/Typography';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import GeneralInformation from 'components/TaskDetails/GeneralInformation';
import TaskMock from 'mocks/taskDetails/task';

const ProcessForm = () => (
  <>
    <Typography variant="h2" component="h1">New Request Form</Typography>
    <Typography variant="subtitle2" component="h2">This form is used to submit a reduced rates request for Friends and Family</Typography>
    <Stepper activeStep={1} alternativeLabel>
      <Step>
        <StepLabel>General Information</StepLabel>
      </Step>
      <Step>
        <StepLabel>Trip Details</StepLabel>
      </Step>
      <Step>
        <StepLabel>Billing Information</StepLabel>
      </Step>
      <Step>
        <StepLabel>Request Summary</StepLabel>
      </Step>
    </Stepper>
    <GeneralInformation taskInputData={TaskMock.payload.inputData} noHeadline />
  </>
);

export default ProcessForm;
