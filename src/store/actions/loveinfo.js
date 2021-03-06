/*
 * action types
 */
export const actionTypes = {
  SET_TOPINFO: 'info/SET_TOPINFO',
  SET_LIKE_TOPINFO: 'info/SET_LIKE_TOPINFO',
  SET_LOCKS: 'info/SET_LOCKS',
  CONFIRM_LOCK: 'info/CONFIRM_LOCK',
  SET_MEMORIES: 'info/SET_MEMORIES',
  UPDATE_MEMORY: 'info/UPDATE_MEMORY',
  SET_BLOG_VIEW: 'info/SET_BLOG_VIEW',
  UPDATE_BALANCES: 'info/UPDATE_BALANCES',
  SET_RECENT_DATA: 'info/SET_RECENT_DATA',
};
/*
 * action creators
 */
export const setTopInfo = data => ({ type: actionTypes.SET_TOPINFO, data });
export const setLikeTopInfo = data => ({ type: actionTypes.SET_LIKE_TOPINFO, data });
export const setLocks = data => ({ type: actionTypes.SET_LOCKS, data });
export const confirmLock = data => ({ type: actionTypes.CONFIRM_LOCK, data });
export const setMemories = data => ({ type: actionTypes.SET_MEMORIES, data });
export const updateMemory = data => ({ type: actionTypes.UPDATE_MEMORY, data });
export const setBlogView = data => ({ type: actionTypes.SET_BLOG_VIEW, data });
export const updateBalances = data => ({ type: actionTypes.UPDATE_BALANCES, data });
export const setRecentData = data => ({ type: actionTypes.SET_RECENT_DATA, data });
