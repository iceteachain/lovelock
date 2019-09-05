import React, { useState, useEffect } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { ButtonPro } from '../../../elements/Button';
import * as actions from '../../../../store/actions';
import styled from 'styled-components';
import MessageHistory from '../../Memory/MessageHistory';
import CustomPost from './CustomPost';
import { rem } from '../../../elements/StyledUtils';
import { saveToIpfs, sendTransaction, callView, getTagsInfo } from '../../../../helper';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputBase from '@material-ui/core/InputBase';

const RightBox = styled.div`
 padding: 0 ${rem(15)} ${rem(45)} ${rem(45)};
  /* position: relative;
  width: 100%;
  min-height: ${rem(360)};
  box-sizing: border-box;
  padding-left: ${rem(30)}; */
  /* .fl {
    float: left;
  }
  .fr {
    float: right;
  }
  .post_container {
    display: flex;
    width: 100%;
    .user_avatar {
      img {
        width: 58px;
        height: 58px;
      }
      border-radius: 10px;
      overflow: hidden;
      margin-right: ${rem(10)};
    }
    .post_input {
      width: 100%;
      height: 50px;
      display: flex;
      align-items: center;
      .contentEditable {
        width: 100%;
        height: 19px;
        font-size: 16px;
        font-weight: 500;
        font-style: normal;
        font-stretch: normal;
        line-height: normal;
        letter-spacing: normal;
        color: #8f8f8f;
        outline: none;
        font-size: ${rem(16)};
      }
    } */
  /* } */
  /* .action {
    width: 100%;
    margin: 16px 0 16px;
    display: inline-block;
    .privacy {
      display: inline-block;
    }
    button {
      width: 254px;
      line-height: 34px;
      float: right;
      font-weight: 600;
      border-radius: 23px;
    }
    .btn_post_policy {
      width: 102px;
      height: 36px;
      border-radius: 21px;
      background: #ffffff;
      border: 1px solid #8250c8;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      font-weight: 500;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: normal;
      color: #8f36b3;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 10px;
    }
  } */
`;
const GrayLayout = styled.div`
  background: ${props => props.grayLayout && 'rgba(0, 0, 0, 0.5)'};
  transition: background 0.3s ease;
  position: ${props => props.grayLayout && 'fixed'};
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  z-index: 1;
`;

const CreatePost = styled.div`
  position: relative;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  z-index: 2 !important;
`;
const ShadowBox = styled.div`
  padding: 30px;
  border-radius: 5px;
  background: #fff;
  box-shadow: '0 1px 4px 0 rgba(0, 0, 0, 0.15)';
`;
const useStyles = makeStyles(theme => ({
  margin: {
    // margin: theme.spacing(1),
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 1,
  },
  btShare: {
    width: 254,
    height: 46,
    borderRadius: 23,
  },
  outlinedRoot: {
    fontSize: 16,
  },
  selectStyle: {
    minWidth: 110,
    height: 36,
    fontSize: 12,
    color: '#8250c8',
  },
  selectIcon: {
    width: 24,
    height: 24,
    color: '#8250c8',
    marginRight: theme.spacing(1),
  },
}));

const BootstrapInput = withStyles(theme => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    borderRadius: 23,
    position: 'relative',
    border: '1px solid #8250c8',
    padding: '10px 18px 11px 18px',
    boxSizing: 'border-box',
    '&:focus': {
      borderRadius: 23,
      borderColor: '#8250c8',
    },
  },
}))(InputBase);

export default function RightContrainer(props) {
  const classes = useStyles();
  const layoutRef = React.createRef();
  const InputProps = {
    classes: {
      root: classes.outlinedRoot,
      // underline: classes.outlinedRoot,
    },
  };
  const { proIndex } = props;
  const dispatch = useDispatch();
  const privateKey = useSelector(state => state.account.privateKey);
  const [loading, setLoading] = useState(true);
  const [memoryList, setMemoryList] = useState([]);
  const [filePath, setFilePath] = useState(null);
  const [memoryContent, setMemoryContent] = useState(null);
  const [grayLayout, setGrayLayout] = useState(false);

  const [date, setDate] = useState(new Date());
  // const [loading, setLoading] = useState(null);

  useEffect(() => {
    async function fetchData() {
      await loadMemory();
    }
    fetchData();
  }, [proIndex]);

  function setGLoading(value) {
    dispatch(actions.setLoading(value));
  }
  // function setMemory(value) {
  //   dispatch(actions.setMemory(value));
  // }
  function setNeedAuth(value) {
    dispatch(actions.setNeedAuth(value));
  }

  function memoryChange(e) {
    setMemoryContent(e.target.value);
    // console.log('memoryChange');
  }
  function memoryOnFocus(e) {
    // console.log('memoryChange', e);
    setGrayLayout(true);
  }
  function clickLayout(e) {
    e.target === layoutRef.current && setGrayLayout(false);
  }
  function onChangeCus(date, file) {
    setDate(date);
    setFilePath(file);
  }

  async function loadMemory() {
    const { proIndex } = props;
    const allMemory = await callView('getMemoryByProIndex', [proIndex]);
    let newMemoryList = [];

    for (let i = 0; i < allMemory.length; i++) {
      const obj = allMemory[i];
      const sender = obj.sender;
      obj.info = JSON.parse(obj.info);
      const reps = await getTagsInfo(sender);
      obj.name = reps['display-name'];
      obj.index = [i];
      newMemoryList.push(obj);
    }
    newMemoryList = newMemoryList.reverse();
    // console.log('newMemoryList', newMemoryList);
    // setMemory(newMemoryList);
    setMemoryList(newMemoryList);
    setLoading(false);
  }

  async function shareMemory(memoryContent, date, file) {
    if (!privateKey) {
      // console.log('privateKey', privateKey);
      setNeedAuth(true);
      return;
    }
    setGLoading(true);
    const { proIndex } = props;
    let hash = '';
    if (file) hash = await saveToIpfs(file);

    const method = 'addMemory';
    const info = JSON.stringify({ date, hash });
    const params = [proIndex, memoryContent, info];
    const result = await sendTransaction(method, params);
    // console.log('View result', result);
    if (result) {
      loadMemory();
      // window.alert('Success');
    }
    setGLoading(false);
  }
  const [privacy, setPrivacy] = React.useState(0);

  function handleChange(event) {
    setPrivacy(event.target.value);
    // console.log('privacy', privacy);
  }

  return (
    <RightBox>
      <GrayLayout grayLayout={grayLayout} ref={layoutRef} onClick={clickLayout} />
      <CreatePost>
        <ShadowBox>
          <Grid container direction="column" spacing={3}>
            <Grid item>
              <Grid container spacing={1}>
                <Grid item>
                  <Avatar alt="avata" src="/static/img/user-men.jpg" className={classes.avatar} />
                </Grid>
                <Grid item xs={9}>
                  <TextField
                    fullWidth
                    multiline
                    placeholder="Describe your Memory...."
                    onChange={memoryChange}
                    onFocus={memoryOnFocus}
                    variant="outlined"
                    InputProps={InputProps}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <CustomPost avatarShow onChange={onChangeCus} />
            </Grid>
            {grayLayout && (
              <Grid item>
                <Grid container justify="space-between">
                  <Grid item>
                    <Select
                      native
                      value={privacy}
                      onChange={handleChange}
                      classes={{
                        root: classes.selectStyle,
                        icon: classes.selectIcon,
                      }}
                      input={<BootstrapInput name="privacy" id="outlined-privacy" />}
                    >
                      <option value={0}>Public</option>
                      <option value={1}>Private</option>
                    </Select>
                  </Grid>
                  <Grid item>
                    <ButtonPro
                      onClick={() => {
                        shareMemory(memoryContent, date, filePath);
                      }}
                      className={classes.btShare}
                    >
                      Share
                    </ButtonPro>
                  </Grid>
                </Grid>
              </Grid>
            )}
          </Grid>
        </ShadowBox>
      </CreatePost>
      <MessageHistory loading={loading} memoryList={memoryList} />
    </RightBox>
  );
}
