
const COMMANDS = [
  '.authorize',
  '.disconnect',
  '.help',
  '.open',
];

export default class SforceEvaluator {

  constructor(context, config, nextEvaluator) {
    this._context = context;
    this._config = config;
    this._nextEvaluator = nextEvaluator;
    let conn = new jsforce.Connection();
    for (let key in conn) {
      if (key[0] === '_') { continue; }
      let type = typeof conn[key];
      if (type === 'function') {
        context[key] = function(...args) {
          if (!context.$conn) {
            throw new Error('Connection is not established yet. Type ".authorize" to connect to your instance.');
          }
          return context.$conn[key](...args);
        };
      } else if (type === 'object') {
        Object.defineProperty(context, key, {
          enumerable: true,
          configurable: false,
          get: function() {
            if (!context.$conn) {
              throw new Error('Connection is not established yet. Type ".authorize" to connect to your instance.');
            }
            return context.$conn[key];
          }
        });
      }
    }
  }

  init() {
    jsforce.browser.init(this._config);
    return new jsforce.Promise((resolve, reject) => {
      let handleError = (err) => {
        resolve('Not logged in to Salesforce. Type ".authorize" to connect to your organization.');
      };
      if (jsforce.browser.isLoggedIn()) {
        jsforce.browser.on('connect', (conn) => {
          this._context.$conn = conn;
          conn.identity().then(({ username }) => {
            resolve('Logged in as: ' + username);
          })
          .catch(handleError);
        });
      } else {
        handleError();
      }
    });
  }

  complete(text, pos) {
    if (text[0] === '.') {
      for (let c of COMMANDS) {
        if (c.indexOf(text) === 0) {
          return { text: c, candidates: [{ label: c, type: 'command' }] }
        }
      }
      return { text, candidates: [] };
    } else {
      return this._nextEvaluator.complete(text);
    }
  }

  evaluate(text) {
    if (text[0] === '.') {
      const [ command, ...args ] = text.split(/\s+/);
      switch (command) {
        case '.authorize':
          return { type: 'INFO', result: this.authorize(args) };
        case '.disconnect':
          return { type: 'INFO', result: this.disconnect(args) };
        case '.help':
          return { type: 'INFO', result: this.showHelp(args) };
        case '.open':
          return { type: 'INFO', result: this.openUrl(args) };
        default:
          break;
      }
      throw new Error('No such command: ' + text);
    } else {
      return this._nextEvaluator.evaluate(text);
    }
  }

  authorize(args) {
    jsforce.browser.init({
      loginUrl: args[0] === 'sandbox' ? 'https://test.salesforce.com' : 'https://login.salesforce.com',
      clientId: process.env.SF_CLIENT_ID,
      redirectUri: process.env.SF_REDIRECT_URI,
      proxyUrl: '/proxy/',
    });
    return new jsforce.Promise((resolve, reject) => {
      jsforce.browser.login({}, (err, res) => {
        if (err) { return reject(err); }
        if (res.status === 'cancel') {
          return reject(new Error('Authorization Canceled'));
        }
        let conn = this._context.$conn = jsforce.browser.connection;
        conn.identity().then(({ username }) => {
          return `Logged in as : ${username}`;
        })
        .then(resolve, reject);
      });
    });
  }

  openUrl([ url ]) {
    const { $conn } = this._context;
    if (!$conn) {
      return jsforce.Promise.reject(new Error('Connection is not established yet. Type ".authorize" to connect to your instance'));
    }
    let frontdoorUrl = $conn.instanceUrl + '/secur/frontdoor.jsp?sid=' + $conn.accessToken;
    if (url) {
      frontdoorUrl += "&retURL=" + encodeURIComponent(url);
    }
    window.open(frontdoorUrl);
    return '';
  }

  disconnect() {
    jsforce.browser.logout();
    return 'Disconnect connection.';
  }

  showHelp(args) {
    return [
      '.authorize      Connect to Salesforce using OAuth2 authorization flow',
      '.help           Show repl options',
      '.disconnect     Disconnect connection and erase it from registry',
      '.open           Open Salesforce web page using established connection',
    ].join('\n');
  }

}
