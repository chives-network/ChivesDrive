// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports
import AnalyticsTransactionsLightNode from 'src/views/dashboards/analytics/AnalyticsTransactionsLightNode'
import AnalyticsTransactionHeartBeat from 'src/views/dashboards/analytics/AnalyticsTransactionHeartBeat'
import AnalyticsTransactionReward from 'src/views/dashboards/analytics/AnalyticsTransactionReward'

import axios from 'axios'
import authConfig from 'src/configs/auth'

// ** React Imports
import { useState, useEffect, Fragment } from 'react'

// ** Context
import { useAuth } from 'src/hooks/useAuth'

// ** Third Party Import
import { useTranslation } from 'react-i18next'


import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'

const AnalyticsDashboard = () => {
  // ** Hook
  const { t } = useTranslation()

  const auth = useAuth()
  const currentAddress = auth.currentAddress
  
  const [chainInfo, setChainInfo] = useState<any>()
  const [transactionHeartBeat, setTransactionHeartBeat] = useState<number[]>([])
  const [transactionReward, setTransactionReward] = useState<number[]>([])
  const [haveWallet, setHaveWallet] = useState<boolean>(false)

  useEffect(() => {
    if(currentAddress && currentAddress.length == 43) {
      setHaveWallet(true)
      
      //Frist Time Api Fetch
      //heartbeat List 
      axios.get(authConfig.backEndApi + '/lightnode/heartbeat/' + currentAddress + '/0/10', { headers: { }, params: { } })
        .then(res => {
          setTransactionHeartBeat(res.data.data.filter((record: any) => record.id))
        })
      
      //reward List 
      axios.get(authConfig.backEndApi + '/lightnode/reward/' + currentAddress + '/0/10', { headers: { }, params: { } })
        .then(res => {
          setTransactionReward(res.data.data.filter((record: any) => record.id))
        })
      
      //Chain Info
      axios.get(authConfig.backEndApi + '/lightnode/status', { headers: { }, params: { } })
        .then(res => {
          setChainInfo(res.data);
        })

      const intervalId = setInterval(() => {
          
          //Interval Time Api Fetch
          //Transaction List 
          axios.get(authConfig.backEndApi + '/lightnode/heartbeat/' + currentAddress + '/0/10', { headers: { }, params: { } })
            .then(res => {
              setTransactionHeartBeat(res.data.data.filter((record: any) => record.id))
            })
      
          //reward List 
          axios.get(authConfig.backEndApi + '/lightnode/reward/' + currentAddress + '/0/10', { headers: { }, params: { } })
            .then(res => {
              setTransactionReward(res.data.data.filter((record: any) => record.id))
            })
          
          //Chain Info
          axios.get(authConfig.backEndApi + '/lightnode/status', { headers: { }, params: { } })
            .then(res => {
              setChainInfo(res.data);
            })

      }, 120000);

      return () => clearInterval(intervalId);
      
    }
    else {
      setHaveWallet(false)
    }
  }, [currentAddress])

  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12} md={12}>   
          { haveWallet ?
            <AnalyticsTransactionsLightNode data={chainInfo}/>
          :
          <Card>
            <CardHeader title={t('Please create a wallet first') as string} />
          </Card>
          }       
        </Grid>
        <Grid item xs={12} md={6}>
          {transactionHeartBeat ?
            <AnalyticsTransactionHeartBeat data={transactionHeartBeat}/>
          :
            <Fragment></Fragment>
          }
        </Grid>
        <Grid item xs={12} md={6}>
          {transactionReward ?
            <AnalyticsTransactionReward data={transactionReward}/>
          :
            <Fragment></Fragment>
          }
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

export default AnalyticsDashboard
