// ** React Imports
import { useState, useEffect, Fragment, SyntheticEvent } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** Axios Imports
import axios from 'axios'
import authConfig from 'src/configs/auth'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'

import { DataGrid, GridColDef } from '@mui/x-data-grid'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Actions Imports
import { fetchData } from 'src/store/apps/addresstransactions'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'
import { TxRecordType } from 'src/types/apps/Chivesweave'

import { formatHash, formatXWE, formatTimestampAge, formatStorageSize } from 'src/configs/functions';

// ** Context
import { useAuth } from 'src/hooks/useAuth'

import FormatTxInfoInRow from 'src/pages/preview/FormatTxInfoInRow';

// ** Next Import
import { useRouter } from 'next/router'

import StringDisplay from 'src/pages/preview/StringDisplay';

import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import MuiTabList, { TabListProps } from '@mui/lab/TabList'

import { winstonToAr } from 'src/functions/ChivesweaveWallets'

import UploadFiles from 'src/views/form/uploadfiles';
import SendOut from 'src/views/form/sendout';

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

interface TransactionCellType {
  row: TxRecordType
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

const columns: GridColDef[] = [
  {
    flex: 0.2,
    minWidth: 200,
    field: 'TxId',
    headerName: 'TxId',
    sortable: false,
    filterable: false,
    renderCell: ({ row }: TransactionCellType) => {
      
      return (
        <Typography noWrap variant='body2'>
          <LinkStyled href={`/txs/view/${row.id}`}>{formatHash(row.id, 7)}</LinkStyled>
        </Typography>
      )
    }
  },
  {
    flex: 0.2,
    minWidth: 200,
    field: 'From',
    headerName: 'From',
    sortable: false,
    filterable: false,
    renderCell: ({ row }: TransactionCellType) => {
      
      return (
        <Typography noWrap variant='body2'>
          <LinkStyled href={`/wallet/all/`}>{formatHash(row.owner.address, 7)}</LinkStyled>
        </Typography>
      )
    }
  },
  {
    flex: 0.15,
    minWidth: 100,
    headerName: 'Size',
    field: 'Size',
    sortable: false,
    filterable: false,
    renderCell: ({ row }: TransactionCellType) => {
      return (
        <Typography noWrap variant='body2'>
          {formatStorageSize(row.data.size)}
        </Typography>
      )
    }
  },
  {
    flex: 0.15,
    minWidth: 100,
    field: 'Fee',
    headerName: 'Fee',
    sortable: false,
    filterable: false,
    renderCell: ({ row }: TransactionCellType) => {
      return (
        <Typography noWrap variant='body2'>
          {formatXWE(row.fee.winston, 6)}
        </Typography>
      )
    }
  },
  {
    flex: 0.3,
    minWidth: 200,
    field: 'Info',
    headerName: 'Info',
    sortable: false,
    filterable: false,
    renderCell: ({ row }: TransactionCellType) => {
      return (
        <Typography noWrap variant='body2'>
          <FormatTxInfoInRow TxRecord={row}/>
        </Typography>
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 110,
    field: 'Height',
    headerName: 'Height',
    sortable: false,
    filterable: false,
    renderCell: ({ row }: TransactionCellType) => {
      return (
        <Typography noWrap variant='body2'>
          <LinkStyled href={`/blocks/view/${row.block.height}`}>{row.block.height}</LinkStyled>
        </Typography>
      )
    }
  },
  {
    flex: 0.15,
    field: 'Time',
    minWidth: 220,
    headerName: 'Time',
    sortable: false,
    filterable: false,
    renderCell: ({ row }: TransactionCellType) => {
      return (
        <Typography noWrap variant='body2'>
          {formatTimestampAge(row.block.timestamp)}
        </Typography>
      )
    }
  }
]


// ** Styled Tab component
const TabList = styled(MuiTabList)<TabListProps>(({ theme }) => ({
  '& .MuiTabs-indicator': {
    display: 'none'
  },
  '& .Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    color: `${theme.palette.common.white} !important`
  },
  '& .MuiTab-root': {
    minWidth: 65,
    minHeight: 40,
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    [theme.breakpoints.up('md')]: {
      minWidth: 130
    }
  }
}))


const MyWalletModel = ({ activeTab } : any) => {
  // ** Hook
  const { t } = useTranslation()


  const router = useRouter();

  const auth = useAuth()

  const id = auth.currentAddress

  // ** State
  const [isLoading, setIsLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 15 })

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.addresstransactions)

  const [addressBalance, setAddressBalance] = useState<string>('')

  useEffect(() => {
    if(id != undefined && id.length == 43) {
      axios
        .get(authConfig.backEndApi + '/wallet/' + id + "/balance", { headers: { }, params: { } })
        .then(res => {
          setAddressBalance(winstonToAr(res.data));
        })
        .catch(() => {
          console.log("axios.get editUrl return")
        })
    }
  }, [id])

  useEffect(() => {
    if(id!=undefined && id.length == 43) {
      dispatch(
        fetchData({
          address: String(id),
          pageId: paginationModel.page,
          pageSize: paginationModel.pageSize,
          type: activeTab
        })
      )
    }
  }, [dispatch, paginationModel, id, activeTab])

  const handleChange = (event: SyntheticEvent, value: string) => {
    router
      .push({
        pathname: `/wallet/${value.toLowerCase()}`
      })
      .then(() => setIsLoading(false))
      console.log("handleChangeEvent", event)
  }

  useEffect(() => {
    setIsLoading(false)
  }, [])

  return (
    <Grid container spacing={6}>

    {id != undefined ?
      <Grid item xs={12}>
        <Card>
          <CardHeader title={`${t(`My Wallet`)}`} />
          <CardContent>
            <Grid container spacing={6}>

              <Grid item xs={12} lg={12}>
                <TableContainer>
                  <Table size='small' sx={{ width: '95%' }}>
                    <TableBody
                      sx={{
                        '& .MuiTableCell-root': {
                          border: 0,
                          pt: 2,
                          pb: 2.5,
                          pl: '0 !important',
                          pr: '0 !important',
                          '&:first-of-type': {
                            width: 148
                          }
                        }
                      }}
                    >
                      <TableRow>
                        <TableCell>
                          <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                          {`${t(`Address`)}`}:
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {id && id.length == 43 ?
                            <StringDisplay InputString={id} StringSize={20}/>
                            :
                            <Fragment>{`${t(`No Address`)}`}</Fragment>
                          }
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell>
                          <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                          {`${t(`Balance`)}`}:
                          </Typography>
                        </TableCell>
                        <TableCell>{addressBalance} XWE</TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell>
                          <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                          {`${t(`Total transactions`)}`}:
                          </Typography>
                        </TableCell>
                        <TableCell>{ activeTab != 'uploadfiles' && activeTab != 'sendout' ? store.total : '' }</TableCell>
                      </TableRow>

                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

            </Grid>
          </CardContent>

        </Card>
      </Grid>
    :
      <Fragment></Fragment>
    }

      <Grid item xs={12}>
        <TabContext value={activeTab}>
          <TabList
            variant='scrollable'
            scrollButtons='auto'
            onChange={handleChange}
            aria-label='forced scroll tabs example'
          >
            <Tab
              value='sendout'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 2 } }}>
                  <Icon fontSize={20} icon='mdi:account-outline' />
                  {`${t(`Send`)}`}
                </Box>
              }
            />
            <Tab
              value='uploadfiles'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 2 } }}>
                  <Icon fontSize={20} icon='mdi:account-outline' />
                  {`${t(`Upload Files`)}`}
                </Box>
              }
            />
            <Tab
              value='all'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 2 } }}>
                  <Icon fontSize={20} icon='mdi:account-outline' />
                  {`${t(`All`)}`}
                </Box>
              }
            />
            <Tab
              value='sent'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 2 } }}>
                  <Icon fontSize={20} icon='mdi:lock-outline' />
                  {`${t(`Sent`)}`}
                </Box>
              }
            />
            <Tab
              value='received'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 2 } }}>
                  <Icon fontSize={20} icon='mdi:bookmark-outline' />
                  {`${t(`Received`)}`}
                </Box>
              }
            />
            <Tab
              value='files'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 2 } }}>
                  <Icon fontSize={20} icon='mdi:bell-outline' />
                  {`${t(`Files`)}`}
                </Box>
              }
            />
          </TabList>
        </TabContext>
        <Card>
          {store && store.data != undefined && activeTab != "sendout" && activeTab !="uploadfiles" ?
            <Fragment>
              <CardHeader title='Transactions' />
              <DataGrid
                autoHeight
                rows={store.data}
                rowCount={store.total}
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
            </Fragment>
          :
            <Fragment></Fragment>
          }
          {activeTab == "sendout" ?
            <CardContent>
              <SendOut />
            </CardContent>
          :
            <Fragment></Fragment>
          }
          {activeTab == "uploadfiles" ?
            <CardContent>
              <UploadFiles />
            </CardContent>
          :
            <Fragment></Fragment>
          }
        </Card>
      </Grid>
    </Grid>
  )
}


export default MyWalletModel
