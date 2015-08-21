import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Repl from '../components/Repl';
import { createReplActions } from '../actions/index.js';

import SforceEvaluator from '../service/SforceEvaluator';
import ContextEvaluator from '../service/ContextEvaluator';

const { jsforce } = global;
const ctx = { jsforce };
const ctxEvaluator = new ContextEvaluator(ctx);
const evaluator = new SforceEvaluator(ctxEvaluator.getContext(), {
  clientId: process.env.SF_CLIENT_ID,
  redirectUri: process.env.SF_REDIRECT_URI,
  proxyUrl: '/proxy/',
}, ctxEvaluator);
const replActions = createReplActions(evaluator);

function mapStateToProps(state) {
  return {
    histories: state.histories,
    loading: state.loading,
    prompt: state.prompt,
    candidates: state.candidates,
  }
}

function mapDispatchToProps(dispatch) {
  let ac = bindActionCreators(replActions, dispatch);
  setTimeout(() => ac.init(), 1000);
  return ac;
}

export default connect(mapStateToProps, mapDispatchToProps)(Repl);
