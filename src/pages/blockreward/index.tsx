// ** React Imports
import { useState, useEffect, Fragment } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import CardContent from '@mui/material/CardContent'
import TableContainer from '@mui/material/TableContainer'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Actions Imports
import { fetchData } from 'src/store/apps/blockreward'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

import { isMobile } from 'src/configs/functions'
import Pagination from '@mui/material/Pagination'
import StringDisplay from 'src/pages/preview/StringDisplay'

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

const BlockReward = () => {
  // ** Hook
  const { t } = useTranslation()

  // ** State
  const [isLoading, setIsLoading] = useState(false);

  const paginationModelDefaultValue = { page: 0, pageSize: 100 }
  const [paginationModel, setPaginationModel] = useState(paginationModelDefaultValue)
  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setPaginationModel({ ...paginationModel, page:page });
    console.log("handlePageChange", event)
  }
  const isMobileData = isMobile()

  console.log("paginationModel", paginationModel)

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.blocks)

  useEffect(() => {
    dispatch(
      fetchData()
    )
  }, [dispatch, paginationModel])

  useEffect(() => {
    setIsLoading(false)
  }, [])

  const columns: GridColDef[] = [
    {
      flex: 0.6,
      minWidth: 80,
      field: 'reward_addr',
      headerName: `${t(`Block Reward Address`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: any) => {

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LinkStyled href={`/addresses/all/${row.reward_addr}`}>{row.reward_addr}</LinkStyled>
          </Box>
        )
      }
    },
    {
      flex: 0.4,
      field: 'reward_amount',
      minWidth: 260,
      headerName: `${t(`Block Reward Total Amount`)}`,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap variant='body2'>
            {row.reward_amount}
          </Typography>
        )
      }
    }
  ]

  return (
    <Fragment>
        {isMobileData ?
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <CardHeader title={`${t('Blocks Reward Address In Last 24 Hours')}`} sx={{ px: 5, py: 3 }}/>
            </Card>
          </Grid>
          {store.data.map((row: any, index: number) => {
            return (
              <Grid item xs={12} sx={{ py: 0 }} key={index}>
                <Card>
                  <CardContent>
                    <TableContainer>
                      <Table size='small' sx={{ width: '95%' }}>
                        <TableBody
                          sx={{
                            '& .MuiTableCell-root': {
                              border: 0,
                              pb: 1.5,
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
                              <Typography variant='body2' sx={{ color: 'text.primary', display: 'flex', alignItems: 'center' }}>
                              {`${t(`Address`)}`}：<StringDisplay InputString={`${row.reward_addr}`} StringSize={7} href={`/addresses/all/${row.reward_addr}`}/>
                              </Typography>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <Typography variant='body2' sx={{ color: 'text.primary' }}>
                              {`${t(`Amount`)}`}：{row.reward_amount}
                              </Typography>
                            </TableCell>
                          </TableRow>

                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>
            )
          })}
          <Box sx={{ pl: 5, py: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <Grid item key={"Pagination"} xs={12} sm={12} md={12} lg={12} sx={{ padding: '10px 0 10px 0' }}>
                <Pagination count={Math.ceil(store.total/paginationModel.pageSize)} variant='outlined' color='primary' page={paginationModel.page} onChange={handlePageChange} siblingCount={1} boundaryCount={1} />
              </Grid>
            </Box>
          </Box>
        </Grid>
        :
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <CardHeader title={`${t(`Blocks Reward Address In Last 24 Hours`)}`} />
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
                pageSizeOptions={[10, 15, 20, 30, 50, 100, 300]}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                disableColumnMenu={true}
              />
            </Card>
          </Grid>
        </Grid>
        }
      </Fragment>
  )
}

export default BlockReward
