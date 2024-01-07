
// ** Next Imports
import Link from 'next/link'

// ** MUI Imports
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

import { DataGrid, GridColDef } from '@mui/x-data-grid'

import { formatHash } from 'src/configs/functions';

// ** Third Party Import
import { useTranslation } from 'react-i18next'

interface TransactionCellType {
  row: any
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

const AnalyticsTransactionHeartBeat = (props: propsType) => {
  // ** Hook
  const { t } = useTranslation()
  
  // ** Props
  const { data } = props

  const columns: GridColDef[] = [
    {
      flex: 0.15,
      minWidth: 150,
      field: 'TxId',
      headerName: `${t(`TxId`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: TransactionCellType) => {
        
        return (
          <Typography noWrap variant='body2'>
            <LinkStyled href={`/txs/view/${row.id}`}>{formatHash(row.id, 4)}</LinkStyled>
          </Typography>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 150,
      field: 'Reward',
      headerName: `${t(`Reward`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: TransactionCellType) => {
        return (
          <Typography noWrap variant='body2'>
            {row.quantity.xwe}
          </Typography>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 150,
      field: 'Height',
      headerName: `${t(`Height`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: TransactionCellType) => {
        return (
          <Typography noWrap variant='body2'>
            {row.block.height}
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


export default AnalyticsTransactionHeartBeat
