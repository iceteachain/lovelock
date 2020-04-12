import { actionTypes } from '../actions/globalData';

const initialState = {
  isLoading: false,
  newLockDialog: false,
  photoViewer: false,
  showNotLoginNotify: false,
  triggerElement: null,
  language: "en",
};

const globalData = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_GLOBAL_LOADING:
      return { ...state, isLoading: action.data };
    case actionTypes.SET_SHOW_NEW_LOCK_DIALOG:
      return { ...state, newLockDialog: action.data };
    case actionTypes.SET_SHOW_PHOTO_VIEWER:
      return { ...state, photoViewer: action.data };
    case actionTypes.SET_LANGUAGE:
      return { ...state, language: action.data };
    default:
      return state;
  }
};

export default globalData;
