import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import loggerMiddleware from 'redux-logger';
import rootReducer from '../reducers';

const middlewares = [ thunkMiddleware ];
if (process.env.NODE_ENV !== 'production') {
  middlewares.push(loggerMiddleware);
}
const createStoreWithMiddleware = applyMiddleware(...middlewares)(createStore);

export function configureStore(initialState) {
  return createStoreWithMiddleware(rootReducer, initialState);
}
