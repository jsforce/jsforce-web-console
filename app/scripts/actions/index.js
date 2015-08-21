import { createAction } from 'redux-actions';

function doAction(type, payload) {
  return createAction(type)(payload);
}

function isPromiseLike(o) {
  return typeof o === 'object' && o !== null && typeof o.then === 'function';
}

export function createReplActions(evaluator) {
  return {

    init() {
      return (dispatch) => {
        console.log('#INIT#___');
        const result = evaluator.init();
        if (isPromiseLike(result)) {
          result.then((value) => {
            console.log('value', value);
            dispatch(doAction('OUTPUT_INFO', value));
          });
        } else {
          console.log('result', res);
          dispatch(doAction('OUTPUT_INFO', result));
        }
      }
    },

    requestComplete(text, pos) {
      console.log('requestComplete', text, pos);
      const result = evaluator.complete(text, pos);
      return doAction('COMPLETE', result);
    },

    requestEvaluate(text) {
      console.log('requestEvaluate', text);
      return (dispatch) => {
        dispatch(doAction('SET_PROMPT', ''));
        dispatch(doAction('INPUT_COMMAND', text));
        dispatch(doAction('LOADING_START'));
        try {
          const { type, result } = evaluator.evaluate(text);
          if (isPromiseLike(result)) {
            result.then((value) => {
              dispatch(doAction('LOADING_END'));
              dispatch(doAction(`OUTPUT_${type}`, value));
            }, (err) => {
              dispatch(doAction('LOADING_END'));
              dispatch(doAction('OUTPUT_ERROR', err));
            });
          } else {
            dispatch(doAction('LOADING_END'));
            dispatch(doAction(`OUTPUT_${type}`, result));
          }
        } catch (err) {
          dispatch(doAction('LOADING_END'));
          dispatch(doAction('OUTPUT_ERROR', err));
        }
      };
    }
  };
}
