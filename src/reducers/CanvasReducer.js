import {
  CANVAS_PANNABLE,
  CANVAS_ZOOMABLE,
  CANVAS_ZOOMABLE_PANNABLE
} from './../actions/types';

const INITIAL_STATE = {
  pannable: true,
  zoomable: true
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CANVAS_PANNABLE:
      return { ...state, pannable: action.payload };

    case CANVAS_ZOOMABLE:
      return { ...state, zoomable: action.payload };

    case CANVAS_ZOOMABLE_PANNABLE:
      return { ...state, zoomable: action.payload, pannable: action.payload };

    default:
      return state;
  }
};
