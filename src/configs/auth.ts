export default {
  backEndApi: 'http://112.170.68.77:1985',
  meEndpoint: '/auth/me',
  loginEndpoint: '/jwt/login',
  registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken', // logout | refreshToken
  systemType: 'drive',
  chivesWallets: 'ChivesWallets',
  chivesCurrentWallet: 'ChivesCurrentWallet',
  chivesWalletNickname: 'ChivesWalletNickname',
  'App-Name': 'ChivesDrive',
  'App-Platform': 'web',
  'App-Version': '0.1'
}