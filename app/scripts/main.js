import 'babel-core/polyfill';

import React from 'react';
import Root from './containers/Root';

let jsforce = global.jsforce;

React.render(<Root />, document.getElementById('root'));
