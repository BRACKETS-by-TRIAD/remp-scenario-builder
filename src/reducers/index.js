import { combineReducers } from 'redux';
import SegmentsReducer from './SegmentsReducer';
import TriggersReducer from './TriggersReducer';
import CanvasReducer from './CanvasReducer';

export default combineReducers({
  segments: SegmentsReducer,
  triggers: TriggersReducer,
  canvas: CanvasReducer
});
