import { combineReducers } from 'redux';
import SegmentsReducer from './SegmentsReducer';
import TriggersReducer from './TriggersReducer';
import CanvasReducer from './CanvasReducer';
import ScenarioReducer from './ScenarioReducer';

export default combineReducers({
  segments: SegmentsReducer,
  triggers: TriggersReducer,
  canvas: CanvasReducer,
  scenario: ScenarioReducer
});
