// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports
import AnalyticsBlockList from 'src/views/dashboards/analytics/AnalyticsBlockList'
import AnalyticsTrophy from 'src/views/dashboards/analytics/AnalyticsTrophy'
import AnalyticsLine from 'src/views/dashboards/analytics/AnalyticsLine'
import AnalyticsTransactionsCard from 'src/views/dashboards/analytics/AnalyticsTransactionsCard'

import axios from 'axios'
import authConfig from 'src/configs/auth'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

// ** React Imports
import { useState, useEffect, Fragment } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

import { setChivesReferee } from 'src/functions/ChivesweaveWallets'

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
  // ** Hook
  const { t } = useTranslation()

  const router = useRouter()

  const { referee } = router.query

  const [chainInfo, setChainInfo] = useState<ChainInfoType>()
  const [dataX, setDataX] = useState<string[]>([])
  const [dataWeaveSize, setDataWeaveSize] = useState<number[]>([])
  const [difficulty, setDifficulty] = useState<number[]>([])
  
  const [blocksnumber, setblocksnumber] = useState<number[]>([])
  const [Block_Rewards, setBlock_Rewards] = useState<number[]>([])

  const [blockList, setBlockList] = useState<number[]>([])

  useEffect(() => {
    if(referee && referee.length == 43) {
      setChivesReferee(String(referee))
    }
  }, [referee])

  useEffect(() => {

    axios.get(authConfig.backEndApi + '/statistics_block', { headers: { }, params: { } })
    .then((res) => {
      setDataX(res.data.block_date)
      setblocksnumber(res.data.block_count)
      setBlock_Rewards(res.data.reward)
      setDataWeaveSize(res.data.weave_size)
      setDifficulty(res.data.cumulative_diff)
    })

    //Frist Time Api Fetch
    //Block List 
    axios.get(authConfig.backEndApi + '/blockpage/0/6', { headers: { }, params: { } })
      .then(res => {
        setBlockList(res.data.data.filter((record: any) => record.id))
      })
        
    //Chain Info
    axios.get(authConfig.backEndApi + '/info', { headers: { }, params: { } })
      .then(res => {
        setChainInfo(res.data);
      })
    const intervalId = setInterval(() => {
        
        //Interval Time Api Fetch
        //Block List 
        axios.get(authConfig.backEndApi + '/blockpage/0/6', { headers: { }, params: { } })
          .then(res => {
            setBlockList(res.data.data.filter((record: any) => record.id))
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
        <Grid item xs={12} md={12}>
          {blockList && blockList.length > 0 ?
            <AnalyticsBlockList data={blockList}/>
          :
            <Fragment></Fragment>
          }
        </Grid>
        {dataX && dataX.length>0 && (
          <Fragment>
            <Grid item xs={12} md={6} lg={6}>
              <AnalyticsLine dataX={dataX} dataY={blocksnumber} title={`${t(`Blocks Number Per Day`)}`} bottomText={""}/>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <AnalyticsLine dataX={dataX} dataY={Block_Rewards} title={`${t(`Block Rewards Per Day`)}`} bottomText={""}/>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <AnalyticsLine dataX={dataX} dataY={dataWeaveSize} title={`${t(`Weave Size`)}`} bottomText={""}/>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <AnalyticsLine dataX={dataX} dataY={difficulty} title={`${t(`Difficulty`)}`} bottomText={""}/>
            </Grid>
          </Fragment>
        )}
        
      </Grid>
    </ApexChartWrapper>
  )
}

export default AnalyticsDashboard
