import axios from 'axios';
import * as config from './../config';


import {
    SEGMENTS_CHANGED
} from './types';

  
export function updateSegments(segments) {
    return {
        type: SEGMENTS_CHANGED,
        payload: segments
    };
};

export function fetchSegments() {
    return dispatch => {
        return axios.get(`${config.URL_SEGMENTS_INDEX}`)
                    .then(response => dispatch(updateSegments(response.data.groups)))
                    .catch(error => {
                        // context.commit('notification', {
                        //   show: true,
                        //   color: 'red',
                        //   text: 'Error fetching segment'
                        // });
                        // context.commit('setAjaxLoader', true);
                    });
      }
}
