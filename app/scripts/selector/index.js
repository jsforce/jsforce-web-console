import { createSelector } from 'reselect';


const logsSelector = createSelector(
  [
    (state) => state.histories,
    (state) => state.visibleFrom,
  ],
  (histories, visibleFrom) => {
    console.log(histories, visibleFrom);
    return histories.slice(visibleFrom)
  }
);

const rootSelector = createSelector(
  [
    (state) => state,
    logsSelector,
  ],
  (state, logs) => {
    return { logs, ...state };
  }
)

export default { rootSelector }
