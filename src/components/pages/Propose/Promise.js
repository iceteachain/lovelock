import React from 'react';
import styled from 'styled-components';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import CustomPost from '../Timeline/CustomPost';
import CommonDialog from './CommonDialog';
import tweb3 from '../../../service/tweb3';
import { saveToIpfs } from '../../../helper/index';
import { connect } from 'react-redux';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(0),
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(4),
  },
  textMulti: {
    marginLeft: theme.spacing(0),
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

function TextFieldPlaceholder(props) {
  const classes = useStyles();
  return <TextField className={classes.textField} {...props} />;
}

function TextFieldMultiLine(props) {
  const classes = useStyles();
  return <TextField className={classes.textMulti} {...props} />;
}

export const TagTitle = styled.div`
  width: 100%;
  height: 18px;
  font-family: Montserrat;
  font-size: 14px;
  font-weight: 500;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #141927;
`;
class Promise extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      partner: '',
      promiseStm: '',
      date: new Date(),
      file: '',
      hash: '',
    };
  }

  partnerChange = e => {
    const value = e.target.value;
    this.setState({
      partner: value,
    });
    // console.log("view partnerChange", value);
  };

  promiseStmChange = e => {
    const value = e.target.value;
    this.setState({
      promiseStm: value,
    });
    // console.log("view promiseStmChange", value);
  };

  onChangeCus = (date, file) => {
    console.log('view Date', date);
    console.log('view File', file);
    this.setState({ date, file });
  };

  async createPropose(partner, promiseStm, date, file) {
    const { privateKey, address } = this.props;
    const hash = await saveToIpfs(file);
    // const hash = "QmWxBin3miysL3vZw4eWk83W5WzoUE7qa5FMtdgES17GNM";
    tweb3.wallet.importAccount(privateKey);
    tweb3.wallet.defaultAccount = address;
    const ct = tweb3.contract(process.env.contract);
    // const { address } = tweb3.wallet.createAccount();
    let info = {
      date: date,
      hash: hash,
    };
    info = JSON.stringify(info);
    const name = 'createPropose';
    const result = await ct.methods[name](promiseStm, partner, info).sendCommit();
    // console.log("View result", result);
    if (result) {
      window.alert('Success');
      this.props.close();
    }
  }

  render() {
    const { send, close } = this.props;
    const { partner, promiseStm, date, file, hash } = this.state;
    // console.log("State CK", this.state);

    return (
      <CommonDialog
        title="Promise"
        okText="Send"
        close={close}
        confirm={() => {
          this.createPropose(partner, promiseStm, date, file);
        }}
      >
        <TagTitle>Tag your partner you promise</TagTitle>
        <TextFieldPlaceholder
          id="outlined-helperText"
          placeholder="@partner"
          margin="normal"
          variant="outlined"
          fullWidth
          onChange={this.partnerChange}
        />
        <TagTitle>Your promise</TagTitle>
        <TextFieldMultiLine
          id="outlined-multiline-static"
          placeholder="your promise ..."
          multiline
          fullWidth
          rows="5"
          margin="normal"
          variant="outlined"
          onChange={this.promiseStmChange}
        />
        <CustomPost onChange={this.onChangeCus} />
      </CommonDialog>
    );
  }
}

Promise.defaultProps = {
  send() {},
  close() {},
};

const mapStateToProps = state => {
  //   const { propose, account } = state;
  //   return {
  //     propose: propose.propose,
  //     currentIndex: propose.currentProIndex,
  //     memory: propose.memory,
  //     address: account.address,
  //     privateKey: account.privateKey,
  //   };
};

export default connect(
  mapStateToProps,
  null
)(Promise);