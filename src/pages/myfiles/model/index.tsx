// ** React Imports
import { useState, useEffect, Fragment, SyntheticEvent } from 'react'

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

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Actions Imports
import { fetchData } from 'src/store/apps/myfiles'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'
import { TxRecordType } from 'src/types/apps/Chivesweave'

import Pagination from '@mui/material/Pagination'

import ImageRectangle from 'src/views/portal/ImageRectangle';

// ** Context
import { useAuth } from 'src/hooks/useAuth'

// ** Axios Imports
import axios from 'axios'

// ** Next Import
import { useRouter } from 'next/router'

import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import MuiTabList, { TabListProps } from '@mui/lab/TabList'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import authConfig from 'src/configs/auth'

import StringDisplay from 'src/pages/preview/StringDisplay';
import { formatXWE } from 'src/configs/functions';

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


const FileResourceModel = ({ activeTab } : any) => {

  const router = useRouter();

  const auth = useAuth()

  const id = auth.currentAddress

  // ** State
  const [isLoading, setIsLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ page: 1, pageSize: 8 })
  
  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.myfiles)

  const [addressBalance, setAddressBalance] = useState<number>(0)

  useEffect(() => {
    if(id != undefined && id.length == 43) {
      axios
        .get(authConfig.backEndApi + '/wallet/' + id + "/balance", { headers: { }, params: { } })
        .then(res => {
          setAddressBalance(res.data);
        })
        .catch(() => {
          console.log("axios.get editUrl return")
        })
    }
  }, [id])

  useEffect(() => {
    if(true && id && id.length == 43) {
      dispatch(
        fetchData({
          address: String(id),
          pageId: paginationModel.page - 1,
          pageSize: paginationModel.pageSize,
          type: activeTab
        })
      )
    }
  }, [dispatch, paginationModel, activeTab, id])

  const handleChange = (event: SyntheticEvent, value: string) => {
    router
      .push({
        pathname: `/myfiles/${value.toLowerCase()}`
      })
      .then(() => setIsLoading(false))
      console.log("handleChange", event, isLoading)
  }

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setPaginationModel({ ...paginationModel, page });
    console.log("handlePageChange", event)
  }

  useEffect(() => {
    setIsLoading(false)
  }, [])

  return (
    <Grid container spacing={6}>

    {id != undefined ?
      <Grid item xs={12}>
        <Card>
          <CardHeader title={`My Files`} />
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
                            Address:
                          </Typography>
                        </TableCell>                        
                        <TableCell>
                          {id && id.length == 43 ?
                            <StringDisplay InputString={id} StringSize={20}/>
                            :
                            <Fragment>No Address</Fragment>
                          }
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell>
                          <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                            Balance:
                          </Typography>
                        </TableCell>
                        <TableCell>{formatXWE(addressBalance, 8)} XWE</TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell>
                          <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                            Total transactions:
                          </Typography>
                        </TableCell>
                        <TableCell>{store.total}</TableCell>
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
              value='png'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 2 } }}>
                  <Icon fontSize={20} icon='mdi:account-outline' />
                  Png
                </Box>
              }
            />
            <Tab
              value='jpeg'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 2 } }}>
                  <Icon fontSize={20} icon='mdi:lock-outline' />
                  Jpeg
                </Box>
              }
            />
            <Tab
              value='mp4'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 2 } }}>
                  <Icon fontSize={20} icon='mdi:bookmark-outline' />
                  Mp4
                </Box>
              }
            />
            <Tab
              value='pdf'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 2 } }}>
                  <Icon fontSize={20} icon='mdi:bell-outline' />
                  Pdf
                </Box>
              }
            />
            <Tab
              value='office'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 2 } }}>
                  <Icon fontSize={20} icon='mdi:bell-outline' />
                  Office
                </Box>
              }
            />
            <Tab
              value='stl'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 2 } }}>
                  <Icon fontSize={20} icon='mdi:bell-outline' />
                  Stl
                </Box>
              }
            />
          </TabList>
        </TabContext>

        <Card sx={{ padding: '0 8px' }}>
          <CardHeader title={`${activeTab?.toUpperCase()} Resources`} />
          {store && store.data !== undefined ? (
            <Fragment>
              <Grid container spacing={2}>
                {store.data.map((item: TxRecordType, index: number) => (
                  <Grid item key={index} xs={12} sm={6} md={3} lg={3}>
                    <ImageRectangle item={item} backEndApi={authConfig.backEndApi} FileType={activeTab}/>
                  </Grid>
                ))}
              </Grid>
              <Grid item key={"Pagination"} xs={12} sm={12} md={12} lg={12} sx={{ padding: '10px 0 10px 0' }}>
                <Pagination  count={Number(store.allPages)} variant='outlined' color='primary' page={paginationModel.page} onChange={handlePageChange} />
              </Grid>
            </Fragment>
          ) : (
            <Fragment></Fragment>
          )}
        </Card>
      </Grid>
    </Grid>
  );
  
}


export default FileResourceModel
