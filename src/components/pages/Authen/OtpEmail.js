import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { FormattedMessage } from 'react-intl';
import { OneLineButton } from '../../elements/StyledUtils';
import { ButtonPro } from '../../elements/Button';
import * as actionCreate from '../../../store/actions/create';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack';
import { IceteaId } from 'iceteaid-web';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const i = new IceteaId('xxx');

const useStyles = makeStyles({
  textField: {
    backgroundColor: '#26163E',
    opacity: 0.67,
  },
  input: {
    color: '#FFFFFF',
    borderRadius: 10,
    '&::placeholder': {
      color: '#FFFFFF',
      opacity: 0.67,
    },
  },
  label: {
    color: '#FFFFFF',
    opacity: 0.67,
    '&$focused': {
      opacity: 1,
    },
  },
  buttonBack: {
    backgroundColor: '#43256D',
    color: '#C892FF',
  },
});

export default function OtpEmail({ isSentOtp, setIsSent }) {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const dispatch = useDispatch();
  const classes = useStyles();

  const sendOtp = async () => {
    try {
      const sendOtp = await i.auth.sendOtp(email, 'email');
      setIsSent(true);
      enqueueSnackbar(sendOtp.message, { variant: 'success' });
    } catch (err) {
      enqueueSnackbar(err.message, { variant: 'error' });
    }
  };

  const verifyOtp = async () => {
    try {
      await i.auth.verifyOtp(email, 'email', otp);
      return history.push('/logging');
    } catch (err) {
      enqueueSnackbar(err.message, { variant: 'error' });
    }
  };

  return (
    <>
      <ValidatorForm onSubmit={() => (!isSentOtp ? sendOtp() : verifyOtp())}>
        <TextValidator
          label={<FormattedMessage id="regist.email" />}
          fullWidth
          onChange={(event) => {
            // Fix issue #148
            setEmail(event.currentTarget.value.toLowerCase());
          }}
          name="email"
          validators={['required']}
          errorMessages={[<FormattedMessage id="regist.requiredMes" />]}
          margin="dense"
          value={email}
          inputProps={{ autoComplete: 'email' }}
          variant="filled"
          color="secondary"
          className={classes.textField}
          InputProps={{
            className: classes.input,
          }}
          InputLabelProps={{
            className: classes.label,
          }}
        />
        {isSentOtp && (
          <TextValidator
            label={<FormattedMessage id="regist.otpCode" />}
            fullWidth
            onChange={(event) => {
              // Fix issue #148
              setOtp(event.currentTarget.value.toLowerCase());
            }}
            name="otp"
            validators={['required']}
            errorMessages={[<FormattedMessage id="regist.requiredMes" />]}
            margin="dense"
            value={otp}
            inputProps={{ autoComplete: 'otpCode' }}
            variant="filled"
            color="secondary"
            className={classes.textField}
            InputProps={{
              className: classes.input,
            }}
            InputLabelProps={{
              className: classes.label,
            }}
          />
        )}
        <OneLineButton>
          <Button
            className={classes.buttonBack}
            fullWidth
            color="primary"
            variant="outlined"
            onClick={() => dispatch(actionCreate.setStep('one'))}
          >
            <FormattedMessage id="login.btnBack" />
          </Button>
          {!isSentOtp && (
            <ButtonPro fullWidth variant="contained" color="primary" className="nextBtn" type="submit">
              <FormattedMessage id="login.sendOtp" />
            </ButtonPro>
          )}
          {isSentOtp && (
            <ButtonPro fullWidth variant="contained" color="primary" className="nextBtn" type="submit">
              <FormattedMessage id="next" />
            </ButtonPro>
          )}
        </OneLineButton>
      </ValidatorForm>
    </>
  );
}
