// ** React Imports
import { useState, useEffect, Fragment } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Table from '@mui/material/Table'
import Divider from '@mui/material/Divider'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import CardHeader from '@mui/material/CardHeader'
import TableContainer from '@mui/material/TableContainer'
import TextField from '@mui/material/TextField'

// ** MUI Imports
import Button from '@mui/material/Button'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import { getAllWallets, getWalletBalance, setWalletNickname, getWalletNicknames, getWalletByAddress, downloadTextFile, removePunctuation } from 'src/functions/ChivesweaveWallets'

const MyWallets = () => {
  
  const [walletBalanceMap, setWalletBalanceMap] = useState<any>({})
  const [getAllWalletsData, setGetAllWalletsData] = useState<any>([])
  const [getWalletNicknamesData, setGetWalletNicknamesData] = useState<any>({})

  useEffect(() => {
    setGetAllWalletsData(getAllWallets())
    setGetWalletNicknamesData(getWalletNicknames())
    const walletBalanceMapItem: any = {}
    const processWallets = async () => {
      await Promise.all(getAllWalletsData.map(async (wallet: any) => {
        const currentBalance = await getWalletBalance(wallet.data.arweave.key);
        walletBalanceMapItem[wallet.data.arweave.key] = currentBalance
      }));
      setWalletBalanceMap(walletBalanceMapItem)
    };  
    processWallets();
  }, [])

  const handleInputNicknameChange = (event: any, Address: string) => {
    setWalletNickname(Address, event.target.value as string)
    console.log("event", event.target.value)
    console.log("Address", Address)
  };

  const handleClickToExport = (event: any, Address: string) => {
    console.log("event", event.target.value)
    console.log("Address", Address)
    const fileName = "chivesweave_keyfile_" + Address + "____" + removePunctuation(getWalletNicknamesData[Address]) + ".json";
    const mimeType = "text/plain";
    downloadTextFile(JSON.stringify(getWalletByAddress(Address).jwk), fileName, mimeType);
  };


  return (
    <Fragment>
      {getAllWalletsData ? 
        <Grid container spacing={6}>
          
          <Grid item xs={12}>
            <Card>
              <CardHeader title='My Wallets' />

              <Divider sx={{ m: '0 !important' }} />

              <TableContainer>
                <Table sx={{ minWidth: 500 }}>
                  <TableHead >
                    <TableRow>
                      <TableCell align="center">Id</TableCell>
                      <TableCell align="center">Address</TableCell>
                      <TableCell align="center">Balance</TableCell>
                      <TableCell align="center">Nickname</TableCell>
                      <TableCell align="center">Export</TableCell>
                      <TableCell align="center">Delete</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {getAllWalletsData.map((wallet: any, index: number) => (
                      <TableRow hover key={index} sx={{ '&:last-of-type td': { border: 0 } }}>
                        <TableCell align="center">{(index+1)}</TableCell>
                        <TableCell align="center">{wallet.data.arweave.key}</TableCell>
                        <TableCell align="right">{walletBalanceMap[wallet.data.arweave.key]}</TableCell>
                        <TableCell align="center">
                          <TextField  id={wallet.data.arweave.key} 
                                      label='Nickname' 
                                      variant='standard' 
                                      color='success'
                                      defaultValue={getWalletNicknamesData[wallet.data.arweave.key]}
                                      onChange={(event) => handleInputNicknameChange(event, wallet.data.arweave.key)}
                                      />
                        </TableCell>
                        <TableCell align="center">
                        <Button variant='contained' size='small' endIcon={<Icon icon='mdi:export' />} onClick={(event) => handleClickToExport(event, wallet.data.arweave.key)} >
                          Export
                        </Button>
                        </TableCell>
                        <TableCell align="center">Delete</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
            </Card>
          </Grid>
        </Grid>
      :
        <Fragment></Fragment>
    }
    </Fragment>
  )
}

export default MyWallets
