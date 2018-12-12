import { combineReducers } from 'redux';
import SegmentsReducer from './SegmentsReducer';
import TriggersReducer from './TriggersReducer';

export default combineReducers({
  segments: SegmentsReducer,
  triggers: TriggersReducer
});
