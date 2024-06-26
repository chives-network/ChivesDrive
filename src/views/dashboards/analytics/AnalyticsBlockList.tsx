
import { BlockType } from 'src/types/apps/Chivesweave'

// ** Next Imports
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

import { formatHash, formatSecondToMinute, formatTimestampMemo, formatXWE } from 'src/configs/functions';

// ** Third Party Import
import { useTranslation } from 'react-i18next'

interface BlockCellType {
  row: BlockType
}

const LinkStyled = styled(Link)(({ theme }) => ({
  fontWeight: 550,
  fontSize: '1rem',
  cursor: 'pointer',
  textDecoration: 'none',
  color: theme.palette.text.secondary,
  '&:hover': {
    color: theme.palette.primary.main
  }
}))


export type propsType = {
  data: any[]
}

const AnalyticsBlockList = (props: propsType) => {
  // ** Hook
  const { t } = useTranslation()
  
  // ** Props
  const { data } = props

  const columns: GridColDef[] = [
    {
      flex: 0.15,
      minWidth: 80,
      field: 'Height',
      headerName: `${t(`Height`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: BlockCellType) => {

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LinkStyled href={`/blocks/view/${row.height}`}>{row.height}</LinkStyled>
          </Box>
        )
      }
    },
    {
      flex: 0.4,
      field: 'Time',
      minWidth: 260,
      headerName: `${t(`Time`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: BlockCellType) => {
        return (
          <Typography noWrap variant='body2'>
            {formatTimestampMemo(row.timestamp)}
          </Typography>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 60,
      headerName: `${t(`Txs`)}`,
      field: 'Txs',
      sortable: false,
      filterable: false,
      renderCell: ({ row }: BlockCellType) => {
        return (
          <Typography noWrap variant='body2'>
            {row.txs_length}
          </Typography>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 60,
      headerName: `${t(`Reward`)}`,
      field: 'Reward',
      sortable: false,
      filterable: false,
      renderCell: ({ row }: BlockCellType) => {
        return (
          <Typography noWrap variant='body2'>
            {formatXWE(row.reward, 2)}
          </Typography>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 110,
      field: 'Miner',
      headerName: `${t(`Miner`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: BlockCellType) => {
        return (
          <Typography noWrap variant='body2'>
            <LinkStyled href={`/addresses/all/${row.reward_addr}`}>{formatHash(row.reward_addr, 7)}</LinkStyled>
          </Typography>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 110,
      field: 'MinedTime',
      headerName: `${t(`MinedTime`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: BlockCellType) => {
        return (
          <Typography noWrap variant='body2'>
            {formatSecondToMinute(row.mining_time)}
          </Typography>
        )
      }
    }
  ]

  return (
    <Card>
      <DataGrid autoHeight hideFooter rows={data} columns={columns} disableRowSelectionOnClick pagination={undefined} />
    </Card>
  )
}


export default AnalyticsBlockList
