import React from 'react';
import Root from './containers/Root';

require("babel/polyfill");

let jsforce = global.jsforce;

React.render(<Root />, document.getElementById('root'));
