import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import InputBase from '@material-ui/core/InputBase';

import { FlexBox, FlexWidthBox, rem } from '../../elements/Common';
import Icon from '../../elements/Icon';

import TopContrainer from './TopContrainer';
// import MessageHistory from './MessageHistory';
import Promise from '../Propose/Promise';
import CustomPost from './CustomPost';
// import PromiseAlert from './PromiseAlert';
// import PromiseConfirm from './PromiseConfirm';
// import PromiseLeftAccept from './PromiseLeftAccept';
// import PromiseLeftPending from './PromiseLeftPending';

const BannerContainer = styled.div`
  margin-bottom: ${rem(20)};
`;
const ShadowBox = styled.div`
  padding: 30px;
  border-radius: 10px;
  /* margin-bottom: 20px; */
  background: #ffffff;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.15);
`;

const LeftBox = styled.div`
  width: 100%;
  min-height: ${rem(360)};
  i {
    padding: 0 5px;
  }
  .btn_add_promise {
    width: 172px;
    height: 46px;
    background: #ffffff;
    border-radius: 23px;
    font-weight: 600;
    color: #8250c8;
    border: 1px solid #8250c8;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 30px;
  }
  .title {
    color: #141927;
    font-weight: 600;
    font-size: ${rem(14)};
    text-transform: uppercase;
    margin-bottom: ${rem(20)};
  }
`;
const RightBox = styled.div`
  width: 100%;
  min-height: ${rem(360)};
  box-sizing: border-box;
  padding-left: ${rem(30)};
  .fl {
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
        font-family: Montserrat;
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
    }
  }
  .action {
    width: 100%;
    margin: 16px 0 16px;
    display: inline-block;
    .privacy {
      display: inline-block;
      float: left;
    }
    button {
      width: 254px;
      line-height: 46px;
      float: right;
      font-size: 16px;
      color: #ffffff;
      font-weight: 600;
      border-radius: 23px;
      box-shadow: 0 5px 14px 0 rgba(0, 0, 0, 0.06);
      background-image: -webkit-linear-gradient(118deg, #b276ff, #fe8dc3);
      background-image: linear-gradient(332deg, #b276ff, #fe8dc3);
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
      font-family: Montserrat;
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
  }
`;
const WarrperAcceptedPromise = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: ${rem(20)};
  :hover {
    cursor: pointer;
  }
  .icon {
    width: ${rem(36)};
    height: ${rem(36)};
    margin-right: ${rem(10)};
    border-radius: 50%;
    overflow: hidden;
  }
  .name {
    color: #5a5e67;
  }
  .nick {
    color: #8250c8;
    font-size: ${rem(12)};
  }
`;
const TagBox = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  .tagName {
    color: #8250c8;
    margin-right: ${rem(7)};
    font-size: ${rem(12)};
    :hover {
      cursor: pointer;
    }
  }
`;

class Main extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tag: ['love', 'travel', 'honeymoon', 'relax', 'sweet'],
      ownerTag: ['honeymoon', 'travel'],
      isPromise: false,
      isPendingPromise: false,
      isAccept: false,
      isDeny: false,
      reload: true,
      proIndex: -1,
      pendingIndex: -1,
      date: new Date(),
      file: '',
      memoryContent: '',
      address: '',
      propose: [],
    };
  }

  renderTag = tag => {
    // const { tag } = this.state;
    return tag.map((item, index) => {
      return (
        <span className="tagName" key={index}>
          #{item}
        </span>
      );
    });
  };

  onChangeCus = (date, file) => {
    console.log('view Date', date);
    console.log('view File', file);
    this.setState({ date, file });
  };

  addPromise = () => {
    this.setState({ isPromise: true });
  };

  closePromise = () => {
    this.setState({ isPromise: false });
  };

  render() {
    const {
      tag,
      ownerTag,
      isPromise,
      isPendingPromise,
      isAccept,
      isDeny,
      proIndex,
      pendingIndex,
      date,
      file,
      memoryContent,
    } = this.state;
    return (
      <React.Fragment>
        <BannerContainer>
          <ShadowBox>
            <TopContrainer proIndex={proIndex} />
          </ShadowBox>
        </BannerContainer>

        <FlexBox wrap="wrap">
          <FlexWidthBox width="30%">
            <LeftBox>
              <ShadowBox>
                <button type="button" className="btn_add_promise" onClick={this.addPromise}>
                  <Icon type="add" />
                  Add Promise
                </button>
                <div className="title">Accepted promise</div>
                <div>
                  {/* <PromiseLeftAccept
                    propose={propose}
                    address={address}
                    handlerSelectPropose={this.handlerSelectPropose}
                  /> */}
                </div>
                <div className="title">Pending promise</div>
                <div>{/* <PromiseLeftPending address={address} openPendingPromise={this.openPending} /> */}</div>
                <div className="title">Popular Tag</div>
                <TagBox>{this.renderTag(tag)}</TagBox>
              </ShadowBox>
            </LeftBox>
          </FlexWidthBox>
          <FlexWidthBox width="70%">
            <RightBox>
              <div className="memorypost__content">
                <div className="post_container clearfix">
                  <div className="user_avatar">
                    <img src="/static/img/user-men.jpg" alt="itea" />
                  </div>
                  <div className="post_input fl">
                    <div className="contentEditable">
                      <InputBase
                        fullWidth
                        margin="dense"
                        defaultValue="Describe your Memory…."
                        inputProps={{ 'aria-label': 'naked' }}
                        onChange={this.statusChange}
                      />
                    </div>
                  </div>
                </div>
                <CustomPost avatarShow onChange={this.onChangeCus} />
              </div>

              <div className="action">
                <div className="privacy">
                  <div className="css-1pcexqc-container privacy_select">
                    <div className="css-bg1rzq-control">
                      <div className="css-1hwfws3">
                        <div>
                          <button type="button" disabled="" className="btn_post_policy">
                            Public
                            <div className="css-1wy0on6">
                              <span className="css-bgvzuu-indicatorSeparator" />
                              <div aria-hidden="true" className="css-16pqwjk-indicatorContainer">
                                <i className="material-icons">arrow_drop_down</i>
                              </div>
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  disabled=""
                  onClick={() => {
                    this.shareMemory(proIndex, memoryContent, date, file);
                  }}
                >
                  Share
                </button>
              </div>
              {/* <MessageHistory /> */}
              {isPromise && <Promise close={this.closePromise} />}
            </RightBox>
          </FlexWidthBox>
        </FlexBox>
        {/* 
        {isPendingPromise && (
          <PromiseAlert
            propose={propose}
            address={address}
            index={pendingIndex}
            close={this.closePendingPromise}
            accept={this.acceptPromise}
            deny={this.denyPromise}
          />
        )}
        {isAccept && <PromiseConfirm close={this.closeConfirm} index={pendingIndex} />}
        {isDeny && <PromiseConfirm isDeny close={this.closeConfirm} index={pendingIndex} />} */}
      </React.Fragment>
    );
  }
}

export default Main;