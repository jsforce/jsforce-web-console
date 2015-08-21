import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Repl from '../components/Repl';
import { createReplActions } from '../actions/index.js';

import SforceEvaluator from '../service/SforceEvaluator';
import ContextEvaluator from '../service/ContextEvaluator';

import config from '../config';

const { jsforce } = global;
const ctx = { jsforce };
const ctxEvaluator = new ContextEvaluator(ctx);
const evaluator =
  new SforceEvaluator(ctxEvaluator.getContext(), config.connection, ctxEvaluator);
const replActions = createReplActions(evaluator);

function mapStateToProps(state) {
  return { ...state };
}

function mapDispatchToProps(dispatch) {
  let ac = bindActionCreators(replActions, dispatch);
  setTimeout(() => ac.init(), 1000);
  return ac;
}

export default connect(mapStateToProps, mapDispatchToProps)(Repl);
