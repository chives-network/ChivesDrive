// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

import authConfig from 'src/configs/auth'

const ExplorerNavMenus = [
  {
    title: 'Dashboards',
    icon: 'mdi:home-outline',
    badgeContent: 'new',
    badgeColor: 'error',
    path: '/overview'
  },
  {
    sectionTitle: 'Blocks & Txs'
  },
  {
    title: 'Blocks',
    icon: 'clarity:blocks-group-line',
    path: '/blocks'
  },
  {
    title: 'Block Reward',
    icon: 'material-symbols:rewarded-ads-outline',
    path: '/blockreward'
  },
  {
    title: 'Transactions',
    icon: 'grommet-icons:transaction',
    path: '/txs'
  },
  {
    title: 'Addresses',
    icon: 'clarity:wallet-solid',
    path: '/addresses'
  },
  {
    title: 'Resoures',
    icon: 'mdi:file-multiple',
    path: '/files/image'
  },
  {
    title: 'Staticstics',
    icon: 'mdi:chart-areaspline',
    path: '/statics'
  },
  {
    title: 'Top Stats',
    icon: 'mdi:poll',
    path: '/topstats'
  },
  {
    title: 'Nodes',
    icon: 'fa6-solid:share-nodes',
    path: '/nodes'
  },
  {
    title: 'Memory Pool',
    icon: 'mdi:pool',
    path: '/mempool'
  },
  {
    sectionTitle: 'Apps'
  },
  {
    title: 'Blocks',
    icon: 'clarity:blocks-group-line',
    path: '/blocks'
  }
]

  /*
  {
    title: 'Rewards',
    icon: 'material-symbols:rewarded-ads',
    path: '/lightnode/rewards'
  },
  {
    title: 'All Nodes',
    icon: 'clarity:nodes-line',
    path: '/lightnode/rewards'
  },
  */

const DriveNavMenus = [
  {
    title: 'Dashboards',
    icon: 'mdi:home-outline',
    badgeContent: 'new',
    badgeColor: 'error',
    path: '/overview'
  },
  {
    sectionTitle: 'My Portal'
  },
  {
    title: 'Resources',
    icon: 'material-symbols:captive-portal-rounded',
    path: '/files/image'
  },
  {
    title: 'My Drive',
    icon: 'streamline:hard-disk-solid',
    path: '/drive'
  },
  {
    title: 'My Wallet',
    icon: 'clarity:wallet-solid',
    path: '/wallet'
  },
  {
    title: 'My Files',
    icon: 'mdi:file-multiple',
    path: '/myfiles'
  },
  {
    sectionTitle: 'Blockchain'
  },
  {
    title: 'Block Reward',
    icon: 'material-symbols:rewarded-ads-outline',
    path: '/blockreward'
  },
  {
    title: 'Blocks',
    icon: 'clarity:blocks-group-line',
    path: '/blocks'
  },
  {
    title: 'Transactions',
    icon: 'grommet-icons:transaction',
    path: '/txs'
  },
  {
    title: 'Addresses',
    icon: 'clarity:wallet-solid',
    path: '/addresses'
  },
  {
    title: 'Nodes',
    icon: 'fa6-solid:share-nodes',
    path: '/nodes'
  },
  {
    title: 'Memory Pool',
    icon: 'mdi:pool',
    path: '/mempool'
  },
  {
    sectionTitle: 'Apps Link'
  },
  {
    title: 'Github',
    icon: 'mdi:github',
    externalLink: true,
    openInNewTab: true,
    path: 'https://github.com/chives-network/chivesweave'
  },
  {
    title: 'Web Wallet',
    icon: 'ic:outline-account-balance-wallet',
    externalLink: true,
    openInNewTab: true,
    path: 'https://wallet.chivesweave.org/'
  },
  {
    title: 'App Wallet',
    icon: 'tdesign:app',
    externalLink: true,
    openInNewTab: true,
    path: 'https://web.aowallet.org/'
  },
  {
    title: 'Chrome Extension',
    icon: 'hugeicons:chrome',
    externalLink: true,
    openInNewTab: true,
    path: 'https://chromewebstore.google.com/detail/aowallet-arweave-wallet/dcgmbfihnfgaaokeogiadpgllidjnkgm?hl=en-US&utm_source=ext_sidebar'
  },
  {
    title: 'Google Play',
    icon: 'mdi:google',
    externalLink: true,
    openInNewTab: true,
    path: 'https://play.google.com/store/apps/details?id=org.aowallet.app'
  }
]

const navigation = (): VerticalNavItemsType => {
  let MenuList = null

  switch(authConfig.productName) {
    case 'ChivesDrive':
      MenuList = DriveNavMenus
      break;
    case 'ChivesExplorer':
      MenuList =  ExplorerNavMenus
      break;
  }

  // @ts-ignore
  return MenuList
}

export default navigation
