import uuid from 'uuid/v1';

export default {
  notification(state, payload) {
    state.notification = { ...state.notification, ...payload };
  },
  setAjaxLoader(state, value) {
    state.ajaxLoader = value;
  },
};
