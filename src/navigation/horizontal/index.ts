// ** Type import
import { HorizontalNavItemsType } from 'src/@core/layouts/types'


const navigation = (): HorizontalNavItemsType => {
  return [
    {
      title: 'Dashboards',
      icon: 'mdi:home-outline',
      badgeContent: 'new',
      badgeColor: 'error',
      path: '/overview'
    },
    {
      title: 'Blocks',
      icon: 'clarity:blocks-group-line',
      path: '/blocks'
    },
    {
      title: 'Blocks Reward',
      icon: 'clarity:blocks-group-line',
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
    }
  ]
}

export default navigation
