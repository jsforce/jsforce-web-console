
export default {
  connection:
    window.location.hostname === 'jsforce.github.io' ? {
      clientId: '3MVG9A2kN3Bn17hv5Z.MnUUfJRTgrq0KwgysLOXrljNJ1JB6HijwsXoNi8Imxvwi3b6pknYch_sU771SM1lTh',
      redirectUri: 'https://jsforce.github.io/callback.html',
      proxyUrl: 'https://node-salesforce-proxy.herokuapp.com/proxy/',
    } :
    window.location.hostname === 'jsforce-web-console.herokuapp.com' ? {
      clientId: '3MVG9A2kN3Bn17hv5Z.MnUUfJRerYFaxMXx_QsGfp2rEXA6aI_NeGzgp3RKXjwfRLu_5LbDFqflxmoGwRGsDR',
      redirectUri: 'https://jsforce-web-console.herokuapp.com/callback.html',
      proxyUrl: '/proxy/',
    } : {
      clientId: process.env.SF_CLIENT_ID,
      redirectUri: process.env.SF_REDIRECT_URI,
      proxyUrl: process.env.SF_PROXY_URL,
    }
};
