
const COMMANDS = [
  '.help',
  '.authorize',
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
      jsforce.browser.on('connect', (conn) => {
        this._context.$conn = conn;
        conn.identity().then(({ username }) => {
          resolve('Logged in as: ' + username);
        }, reject);
      });
      setTimeout(() => resolve('Not logged in'), 5000);
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
        case '.help':
          return { type: 'INFO', result: this.showHelp(args) };
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

  showHelp(args) {
    return [
      ' .help       Show this help',
      ' .authorize  Login and connect to Salesforce using OAuth2 flow.'
    ].join('\n');
  }

}
