// ** React Imports
import { ReactElement } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

interface DataType {
  stats: string
  title: string
  color: ThemeColor
  icon: ReactElement
}

interface ChainInfoType {
  network: string
  height: number
  blocks: number
  NotSyncingTxCount: number
  NotSyncingChunksCount: number
  NotSyncingBundleTxParseCount: number
  DataDir: string
  NodeApi: string
}

const renderStats = (data: ChainInfoType) => {
  const salesData: DataType[] = [
    {
      stats: String(data?.height || 0),
      title: 'Block Height',
      color: 'primary',
      icon: <Icon icon='mdi:trending-up' />
    },
    {
      stats: String(data?.blocks || 0),
      title: 'Synced Blocks',
      color: 'success',
      icon: <Icon icon='clarity:blocks-group-line' />
    },
    {
      stats: String(data?.NotSyncingTxCount || 0),
      title: 'Need Syncing Txs',
      color: 'warning',
      icon: <Icon icon='grommet-icons:transaction' />
    },
    {
      stats: String(data?.NotSyncingChunksCount || 0),
      title: 'Need Syncing Chunks',
      color: 'info',
      icon: <Icon icon='ph:files-fill' />
    },
    {
      stats: String(data?.NotSyncingBundleTxParseCount || 0),
      title: 'Need Parse Bundle',
      color: 'error',
      icon: <Icon icon='clarity:bundle-line' />
    },
    {
      stats: String(data?.DataDir || 0),
      title: 'Data Dir',
      color: 'info',
      icon: <Icon icon='material-symbols:folder' />
    }
  ]
  
  return salesData.map((item: DataType, index: number) => (
    <Grid item xs={12} sm={3} key={index}>
      <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
        <CustomAvatar
          variant='rounded'
          color={item.color}
          sx={{ m: 3, boxShadow: 3, width: 44, height: 44, '& svg': { fontSize: '1.75rem' } }}
        >
          {item.icon}
        </CustomAvatar>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant='caption'>{item.title}</Typography>
          <Typography variant='h6'>{item.stats}</Typography>
        </Box>
      </Box>
    </Grid>
  ))
}

export type propsType = {
  data: ChainInfoType
}

const AnalyticsTransactionsLightNode = (props: propsType) => {
  // ** Hook
  const { t } = useTranslation()
  
  // ** Props
  const { data } = props

  return (
    <Card>
      <CardHeader title={`${t(`Chives Light Node`)}`} />
      <CardContent sx={{ pt: (theme: any) => `${theme.spacing(3)} !important` }}>
        <Grid container spacing={[5, 0]}>
          {renderStats(data)}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default AnalyticsTransactionsLightNode
