import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';

const histories = handleActions({
  INPUT_COMMAND: (histories, { payload }) => {
    const history = { type: 'input', ...payload };
    return [ ...histories, history ];
  },
  OUTPUT_RESULT: (histories, { payload }) => {
    const history = { type: 'output', ...payload };
    return [ ...histories, history ];
  },
  OUTPUT_INFO: (histories, { payload: { data: message } }) => {
    const history = { type: 'log', level: 'info', message };
    return [ ...histories, history ];
  },
  OUTPUT_ERROR: (histories, { payload: { message, stack } }) => {
    const history = { type: 'log', level: 'error', message, stack };
    return [ ...histories, history ];
  },
  CLEAR_HISTORIES: () => {
    return [];
  },
}, []);

const loading = handleActions({
  LOADING_START: (loading) => {
    return true;
  },
  LOADING_END: (loading) => {
    return false;
  },
}, false);

const candidates = handleActions({
  INPUT_COMMAND: () => {
    return [];
  },
  COMPLETE: (completions, { payload }) => {
    return payload.candidates;
  },
}, []);

const cursor = handleActions({
  OUTPUT_RESULT: () => {
    return -1;
  },
  SET_CURSOR: (cursor, { payload }) => {
    return payload;
  },
  CLEAR_HISTORIES: () => {
    return -1;
  },
}, -1);

const prompt = handleActions({
  SET_PROMPT: (prompt, action) => {
    return action.payload;
  },
  COMPLETE: (prompt, { payload }) => {
    return payload.text;
  }
}, '');

const rootReducer = combineReducers({
  histories,
  loading,
  prompt,
  cursor,
  candidates,
});

export default rootReducer;
