// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports
import AnalyticsBlockList from 'src/views/dashboards/analytics/AnalyticsBlockList'
import AnalyticsTrophy from 'src/views/dashboards/analytics/AnalyticsTrophy'
import AnalyticsTransactionList from 'src/views/dashboards/analytics/AnalyticsTransactionList'
import AnalyticsTransactionsCard from 'src/views/dashboards/analytics/AnalyticsTransactionsCard'

import axios from 'axios'
import authConfig from 'src/configs/auth'

// ** React Imports
import { useState, useEffect, Fragment } from 'react'

interface ChainInfoType {
  network: string
  version: number
  release: number
  height: number
  current: string
  blocks: number
  peers: number
  time: number
  miningtime: number
  weave_size: number
  denomination: number
  diff: string
}

const AnalyticsDashboard = () => {

  const [chainInfo, setChainInfo] = useState<ChainInfoType>()
  const [blockList, setBlockList] = useState<number[]>([])
  const [transactionList, setTransactionList] = useState<number[]>([])

  useEffect(() => {

    //Frist Time Api Fetch
    //Block List 
    axios.get(authConfig.backEndApi + '/blockpage/1/6', { headers: { }, params: { } })
      .then(res => {
        setBlockList(res.data.data.filter((record: any) => record.id))
      })
    
    //Transaction List 
    axios.get(authConfig.backEndApi + '/transaction/0/6', { headers: { }, params: { } })
      .then(res => {
        setTransactionList(res.data.data.filter((record: any) => record.id))
      })
    
    //Chain Info
    axios.get(authConfig.backEndApi + '/info', { headers: { }, params: { } })
      .then(res => {
        setChainInfo(res.data);
      })
    const intervalId = setInterval(() => {
        
        //Interval Time Api Fetch
        //Block List 
        axios.get(authConfig.backEndApi + '/blockpage/1/6', { headers: { }, params: { } })
          .then(res => {
            setBlockList(res.data.data.filter((record: any) => record.id))
          })
        
        //Transaction List 
        axios.get(authConfig.backEndApi + '/transaction/0/6', { headers: { }, params: { } })
          .then(res => {
            setTransactionList(res.data.data.filter((record: any) => record.id))
          })
        
        //Chain Info
        axios.get(authConfig.backEndApi + '/info', { headers: { }, params: { } })
          .then(res => {
            setChainInfo(res.data);
          })

    }, 120000);

    return () => clearInterval(intervalId);

  }, [])

  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12} md={4}>
          {chainInfo ?
            <AnalyticsTrophy data={chainInfo}/>
          :
            <Fragment></Fragment>
          }          
        </Grid>
        <Grid item xs={12} md={8}>          
          {chainInfo ?
            <AnalyticsTransactionsCard data={chainInfo}/>
          :
            <Fragment></Fragment>
          }
        </Grid>
        <Grid item xs={12} md={4}>
          {transactionList && transactionList.length > 0 ?
            <AnalyticsTransactionList data={transactionList}/>
          :
            <Fragment></Fragment>
          }
        </Grid>
        <Grid item xs={12} md={12} lg={8}>
          {blockList && blockList.length > 0 ?
            <AnalyticsBlockList data={blockList}/>
          :
            <Fragment></Fragment>
          }
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

export default AnalyticsDashboard
