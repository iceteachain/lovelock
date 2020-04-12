import React from 'react';
import { FormattedMessage } from 'react-intl';

// check display language
const language = (navigator.languages && navigator.languages[0]) || navigator.language || navigator.userLanguage;
const languageWithoutRegionCode = language.toLowerCase().split(/[_-]+/)[0];
const ja = 'ja';

const appConstants = {
  textByLockTypes: {
    lock: {
      messageLabel: <FormattedMessage id="newLock.msgLockCrush" />,
      messagePlaceholder:
        languageWithoutRegionCode === ja ? 'パートナーに何かを言ってください。' : 'Say something to your partner…',
      okButton: <FormattedMessage id="newLock.btnSend" />,
      sent: 'Lock request sent',
    },
    crush: {
      messageLabel: <FormattedMessage id="newLock.msgLockCrush" />,
      messagePlaceholder:
        languageWithoutRegionCode === ja ? '好きな人に自分のことを紹介して' : 'Express yourself to your crush…',
      okButton: <FormattedMessage id="newLock.btnCreate" />,
      sent: 'Lock created',
    },
    journal: {
      messageLabel: <FormattedMessage id="newLock.msgJournal" />,
      messagePlaceholder: languageWithoutRegionCode === ja ? '私の素晴らしいブログ' : 'My Amazing Blog',
      okButton: <FormattedMessage id="newLock.btnCreate" />,
      sent: 'Journal created',
    },
  },
  memoryTypes: {
    systemGenerated: 1,
    manualGenerated: 0,
  },
  memoryPageSize: 30,
};

export default appConstants;
