import { combineReducers } from 'redux';
import SegmentsReducer from './SegmentsReducer';

export default combineReducers({
    segments: SegmentsReducer,
});
