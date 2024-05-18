import os from 'os'

const hostname = os.hostname();

console.log('Hostname:', hostname);

export default {
  productName: 'ChivesDrive',
  tokenName: 'XWE',
  backEndApi: (hostname == 'localhost') ? 'http://localhost:1985' : 'https://api.chivesweave.net:1986', //https://api.chivesweave.net:1986,
  faucetApi: 'https://faucet.chivesweave.org/faucet.php',
  checkNodeavAilability: 'https://faucet.chivesweave.org/checkNodeavAilability.php',
  getNodeInternetIp: 'https://faucet.chivesweave.org/getNodeInternetIp.php',
  backEndApiChatBook: 'https://chatbookai.net', // https://chatbookai.net
  meEndpoint: '/auth/me',
  loginEndpoint: '/jwt/login',
  registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken', // logout | refreshToken
  chivesWallets: 'ChivesWallets',
  chivesCurrentWallet: 'ChivesCurrentWallet',
  chivesWalletNickname: 'ChivesWalletNickname',
  chivesDriveActions: 'ChivesDriveActions',
  chivesTxStatus: 'ChivesTxStatus',
  chivesLanguage: 'ChivesLanguage',
  chivesProfile: 'ChivesProfile',
  chivesReferee: 'ChivesReferee',
  'App-Name': 'ChivesDrive',
  'App-Version': '0.1',
  'App-Instance': ''
}