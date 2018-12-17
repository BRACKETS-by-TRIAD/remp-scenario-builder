import axios from 'axios';
import * as config from './../config';

import { TRIGGERS_CHANGED } from './types';

export function updateTriggers(triggers) {
  return {
    type: TRIGGERS_CHANGED,
    payload: triggers
  };
}

export function fetchTriggers() {
  return dispatch => {
    return axios
      .get(`${config.URL_TRIGGERS_INDEX}`)
      .then(response => dispatch(updateTriggers(response.data.events)))
      .catch(error => {
        console.log(error);
      });
  };
}
