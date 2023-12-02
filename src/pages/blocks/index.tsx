// ** React Imports
import { useState, useEffect, Fragment } from 'react'

// ** Axios Imports
import axios from 'axios'
import authConfig from 'src/configs/auth'

// ** Next Imports
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import CardContent from '@mui/material/CardContent'
import TableContainer from '@mui/material/TableContainer'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Actions Imports
import { fetchData } from 'src/store/apps/blocks'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'
import { BlockType } from 'src/types/apps/Chivesweave'

import { formatHash, formatXWE, formatSecondToMinute, formatTimestampMemo, formatStorageSize, formatTimestamp } from 'src/configs/functions';

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

const BlockList = () => {
  // ** Hook
  const { t } = useTranslation()

  // ** State
  const [isLoading, setIsLoading] = useState(false);

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 15 })

  console.log("paginationModel", paginationModel)
  
  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.blocks)

  useEffect(() => {
    dispatch(
      fetchData({
        pageId: paginationModel.page,
        pageSize: paginationModel.pageSize
      })
    )
  }, [dispatch, paginationModel])

  useEffect(() => {
    setIsLoading(false)
  }, [])

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
      flex: 0.2,
      minWidth: 200,
      field: 'Hash',
      headerName: `${t(`Hash`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: BlockCellType) => {
        
        return (
          <Typography noWrap variant='body2'>
            <LinkStyled href={`/blocks/view/${row.height}`}>{formatHash(row.indep_hash, 7)}</LinkStyled>
          </Typography>
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
      flex: 0.1,
      minWidth: 110,
      field: 'Reward',
      headerName: `${t(`Reward`)}`,
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
      flex: 0.1,
      minWidth: 100,
      field: 'Size',
      headerName: `${t(`Size`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: BlockCellType) => {
        return (
          <Typography noWrap variant='body2'>
            {formatStorageSize(row.block_size)}
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
    <Grid container spacing={6}>

      <Grid item xs={12}>
        <Card>
          <CardHeader title={`${t(`Blocks`)}`} />
          <Divider />
          <DataGrid
            autoHeight
            rows={store.data}
            rowCount={store.total as number}
            columns={columns}
            sortingMode='server'
            paginationMode='server'
            filterMode="server"
            loading={isLoading}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 15, 20, 30, 50, 100]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            disableColumnMenu={true}
          />
        </Card>
      </Grid>
    </Grid>
  )
}

export default BlockList
