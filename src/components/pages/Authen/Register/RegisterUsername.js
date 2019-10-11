import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';
import CameraAltIcon from '@material-ui/icons/CameraAlt';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import Box from '@material-ui/core/Box';
import { useSnackbar } from 'notistack';

import tweb3 from '../../../../service/tweb3';
import { isAliasRegisted, wallet, registerAlias, setTagsInfo, saveFileToIpfs } from '../../../../helper';
import { ButtonPro, LinkPro } from '../../../elements/Button';
import { AvatarPro } from '../../../elements';
import ImageCrop from '../../../elements/ImageCrop';
import * as actionGlobal from '../../../../store/actions/globalData';
import * as actionAccount from '../../../../store/actions/account';
import * as actionCreate from '../../../../store/actions/create';
import { DivControlBtnKeystore, FlexBox } from '../../../elements/StyledUtils';

const useStyles = makeStyles(theme => ({
  rightIcon: {
    marginLeft: theme.spacing(1),
  },
  marginRight: {
    marginRight: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  avatarBox: {
    marginTop: theme.spacing(1),
  },
  avatar: {
    width: 100,
    height: 100,
  },
}));

const PreviewContainter = styled.div`
  padding: 10px 0 0 0;
  display: flex;
  flex-direction: row;
  -webkit-box-pack: justify;
  font-size: 14px;
  cursor: pointer;
  .upload_img input[type='file'] {
    font-size: 100px;
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
    cursor: pointer;
  }
  .upload_img {
    position: relative;
    overflow: hidden;
    display: inline-block;
    cursor: pointer;
    &:hover .changeImg {
      display: block;
    }
  }
  .changeImg {
    cursor: pointer;
    position: absolute;
    display: none;
    width: 100px;
    height: 50px;
    top: 50px;
    left: 0;
    right: 0;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.5);
    color: #fff;
    font-size: 80%;
    line-height: 2;
    overflow: hidden;
    border-bottom-left-radius: 600px;
    border-bottom-right-radius: 600px;
  }
  .fileInput {
    width: 120px;
    height: 50px;
    padding: 2px;
    cursor: pointer;
  }
`;

function RegisterUsername(props) {
  const { setStep, setLoading, setAccount } = props;
  const [username, setUsername] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [avatar, setAvatar] = useState('/static/img/no-avatar.jpg');
  const [avatarData, setAvatarData] = useState('');
  const [isOpenCrop, setIsOpenCrop] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [originFile, setOriginFile] = useState([]);

  useEffect(() => {
    ValidatorForm.addValidationRule('isPasswordMatch', value => {
      if (value !== password) {
        return false;
      }
      return true;
    });

    // Fix issue #148
    ValidatorForm.addValidationRule('specialCharacter', async name => {
      // const regex = new RegExp('^(?=.{3,20}$)(?![_.])(?!.*[_.]{2})[a-z0-9._]+(?<![_.])$');
      const regex = new RegExp('^(?![_.])(?!.*[_.]{2})[a-z0-9._]+(?<![_.])$');
      return regex.test(name);
    });

    ValidatorForm.addValidationRule('isAliasRegisted', async name => {
      const resp = await isAliasRegisted(name);
      return !resp;
    });

    return () => {
      ValidatorForm.removeValidationRule('isPasswordMatch');
      ValidatorForm.removeValidationRule('isAliasRegisted');
    };
  }, [password]);

  async function gotoNext() {
    const isUsernameRegisted = await isAliasRegisted(username);
    if (isUsernameRegisted) {
      const message = 'Username already exists! Please choose another.';
      enqueueSnackbar(message, { variant: 'error' });
    } else {
      setLoading(true);
      setTimeout(async () => {
        try {
          const account = await createAccountWithMneomnic();
          const { privateKey, address, publicKey, mnemonic } = account;
          const displayname = `${firstname} ${lastname}`;

          // setAccount({ username, address, privateKey, publicKey, cipher: password, mnemonic });
          tweb3.wallet.importAccount(privateKey);
          tweb3.wallet.defaultAccount = address;

          const registerInfo = [];
          registerInfo.push(registerAlias(username, address));
          registerInfo.push(setTagsInfo('display-name', displayname, { address }));
          registerInfo.push(setTagsInfo('firstname', firstname, { address }));
          registerInfo.push(setTagsInfo('lastname', lastname, { address }));
          registerInfo.push(setTagsInfo('pub-key', publicKey, { address }));
          if (avatarData) {
            const hash = await saveFileToIpfs(avatarData);
            registerInfo.push(setTagsInfo('avatar', hash, { address }));
          }
          await Promise.all(registerInfo);

          const newAccount = {
            address,
            privateKey,
            cipher: password,
            publicKey,
            mnemonic,
          };
          setAccount(newAccount);
          setLoading(false);
          setStep('two');
        } catch (error) {
          console.log('error', error);
          const message = `An error has occured. Detail:${error}`;
          enqueueSnackbar(message, { variant: 'error' });
          setLoading(false);
        }
      }, 100);
    }
  }

  function createAccountWithMneomnic() {
    const resp = wallet.createAccountWithMneomnic();
    return {
      privateKey: resp.privateKey,
      address: resp.address,
      mnemonic: resp.mnemonic,
      publicKey: resp.publicKey,
    };
  }

  function gotoLogin() {
    const { history } = props;
    history.push('/login');
  }

  function handleImageChange(event) {
    event.preventDefault();
    const orFiles = event.target.files;

    if (orFiles.length > 0) {
      setOriginFile(orFiles);
      setIsOpenCrop(true);
    } else {
      setIsOpenCrop(false);
    }
  }

  function closeCrop() {
    setIsOpenCrop(false);
  }

  function acceptCrop(e) {
    closeCrop();
    setAvatarData(e.cropFile);
    setAvatar(e.avaPreview);
  }

  const classes = useStyles();
  return (
    <div>
      <ValidatorForm onSubmit={gotoNext}>
        <TextValidator
          label="Username"
          fullWidth
          onChange={event => {
            // Fix issue #148
            setUsername(event.currentTarget.value.toLowerCase());
          }}
          name="username"
          validators={['required', 'specialCharacter', 'isAliasRegisted']}
          errorMessages={[
            'This field is required',
            'Username cannot contain spaces and special character',
            'Username already exists! Please choose another',
          ]}
          margin="dense"
          value={username}
        />
        <FlexBox>
          <TextValidator
            label="First Name"
            fullWidth
            onChange={event => {
              setFirstname(event.currentTarget.value);
            }}
            name="firstname"
            validators={['required']}
            errorMessages={['This field is required']}
            className={classes.marginRight}
            margin="dense"
            value={firstname}
          />
          <TextValidator
            label="Last Name"
            fullWidth
            onChange={event => {
              setLastname(event.currentTarget.value);
            }}
            name="lastname"
            validators={['required']}
            errorMessages={['This field is required']}
            margin="dense"
            value={lastname}
          />
        </FlexBox>
        <TextValidator
          label="Password"
          fullWidth
          onChange={event => {
            setPassword(event.currentTarget.value);
          }}
          name="password"
          type="password"
          validators={['required']}
          errorMessages={['This field is required']}
          margin="dense"
          value={password}
        />
        <TextValidator
          label="Repeat password"
          fullWidth
          onChange={event => {
            setRePassword(event.currentTarget.value);
          }}
          name="rePassword"
          type="password"
          validators={['isPasswordMatch', 'required']}
          errorMessages={['Password mismatch', 'This field is required']}
          margin="dense"
          value={rePassword}
        />
        <Box display="flex" className={classes.avatarBox}>
          <span>Avatar</span>
          {/* <div>
            <AvatarPro src={avatar} className={classes.avatar} />
            <input className="fileInput" type="file" onChange={handleImageChange} accept="image/*" />
          </div> */}
          <PreviewContainter>
            <div className="upload_img">
              <AvatarPro src={avatar} className={classes.avatar} />
              <div className="changeImg">
                <input className="fileInput" type="file" onChange={handleImageChange} accept="image/*" />
                <CameraAltIcon />
              </div>
            </div>
          </PreviewContainter>
        </Box>

        <DivControlBtnKeystore>
          <LinkPro onClick={gotoLogin}>Already had an account? Login</LinkPro>
          <ButtonPro type="submit">
            Next
            <Icon className={classes.rightIcon}>arrow_right_alt</Icon>
          </ButtonPro>
        </DivControlBtnKeystore>
      </ValidatorForm>
      {isOpenCrop && <ImageCrop close={closeCrop} accept={acceptCrop} originFile={originFile} />}
    </div>
  );
}

// const mapStateToProps = state => {
//   const e = state.create;
//   return {
//   };
// };

const mapDispatchToProps = dispatch => {
  return {
    setAccount: value => {
      dispatch(actionAccount.setAccount(value));
    },
    setStep: value => {
      dispatch(actionCreate.setStep(value));
    },
    setLoading: value => {
      dispatch(actionGlobal.setLoading(value));
    },
  };
};

export default withRouter(
  connect(
    null,
    mapDispatchToProps
  )(RegisterUsername)
);
