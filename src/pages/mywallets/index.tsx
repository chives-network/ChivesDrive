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
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import TableContainer from '@mui/material/TableContainer'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** MUI Imports
import Button from '@mui/material/Button'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import UploadWalletJsonFile from 'src/views/form/UploadWalletJsonFile'

import { getAllWallets, getWalletBalance, setWalletNickname, getWalletNicknames, getWalletByAddress, downloadTextFile, removePunctuation, deleteWalletById, parseBundleTx, getCurrentWalletAddress } from 'src/functions/ChivesweaveWallets'

import axios from 'axios'
import authConfig from 'src/configs/auth'

// ** Third Party Import
import { useTranslation } from 'react-i18next'
import { isMobile, formatHash } from 'src/configs/functions'

import toast from 'react-hot-toast'

const MyWallets = () => {
  // ** Hook
  const { t } = useTranslation()
    
  const [walletBalanceMap, setWalletBalanceMap] = useState<any>({})
  const [getAllWalletsData, setGetAllWalletsData] = useState<any>([])
  const [getWalletNicknamesData, setGetWalletNicknamesData] = useState<any>({})
  const [createWalletWindow, setCreateWalletWindow] = useState<boolean>(false)
  const [isDialog, setIsDialog] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const [wantDeleteWalletId, setWantDeleteWalletId] = useState<string>("")
  const [wantDeleteWalletAddress, setWantDeleteWalletAddress] = useState<string>("")
  const [refreshWalletData, setRefreshWalletData] = useState<number>(0)
  const [faucetButtonMap, setFaucetButtonMap] = useState<any>({})
  const isMobileData = isMobile()

  const [currentAddress, setCurrentAddress] = useState<string>("")
  
  const { setAuthContextCurrentAddress } = useAuth()

  useEffect(() => {

    const currentAddressTemp = getCurrentWalletAddress()
    console.log("currentAddressTemp", currentAddressTemp)
    setCurrentAddress(currentAddressTemp)

    const myTask = () => {
      setRefreshWalletData(refreshWalletData+1);
    };
    const intervalId = setInterval(myTask, 2 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const currentAddressTemp = getCurrentWalletAddress()
    setAuthContextCurrentAddress(currentAddressTemp)
    setCurrentAddress(currentAddressTemp)

    if(createWalletWindow == false) {
      setGetAllWalletsData(getAllWallets())
      setGetWalletNicknamesData(getWalletNicknames())
    }
  }, [createWalletWindow, refreshWalletData])

  useEffect(() => {
    const walletBalanceMapItem: any = {}
    const processWallets = async () => {
      await Promise.all(getAllWalletsData.map(async (wallet: any) => {
        const currentBalance = await getWalletBalance(wallet.data.arweave.key);
        walletBalanceMapItem[wallet.data.arweave.key] = currentBalance
      }));
      setWalletBalanceMap(walletBalanceMapItem)
    };  
    processWallets();
  }, [getAllWalletsData])

  const handleInputNicknameChange = (event: any, Address: string) => {
    setWalletNickname(Address, event.target.value as string);
    console.log("event", event.target.value);
    console.log("Address", Address);
  };

  const handleClickToExport = (event: any, Address: string) => {
    console.log("event", event.target.value);
    console.log("Address", Address);
    const fileName = "chivesweave_keyfile_" + Address + "____" + removePunctuation(getWalletNicknamesData[Address]) + ".json";
    const mimeType = "text/plain";
    downloadTextFile(JSON.stringify(getWalletByAddress(Address).jwk), fileName, mimeType);
  };

  const handleClickToFaucet = async (event: any, Address: string) => {
    console.log("event", event.target.value);
    console.log("Address", Address);
    const formData = new FormData();
    formData.append('Address',Address);
    const Info = await axios.get(authConfig.backEndApi+"/info").then(res => {
      return res.data
    });
    formData.append('current',Info.current);
    formData.append('height',Info.height);
    formData.append('diff',Info.diff);
    axios.post(authConfig.faucetApi, formData).then(res => {
      console.log("res", res.data)
      setFaucetButtonMap({...faucetButtonMap, [Address]:true})
      if(res.data['result']=="OK")  {
        toast.success(t("Successfully acquired 0.05 XWE, estimated to be deposited into your wallet in 3-10 minutes.") as string, { duration: 4000 })
      }
      else {
        toast.error(res.data['result'], { duration: 4000 })
      }
      console.log("faucetButtonMap", faucetButtonMap)
    });
  };

  const handleClickToDelete = (event: any, Address: string, WalletId: string) => {
    setWantDeleteWalletId(WalletId)
    setWantDeleteWalletAddress(Address)
    setIsDialog(true);
    setOpen(true);
  };

  const handleNoClose = () => {
    setOpen(false)
    setIsDialog(false)
  }

  const handleYesClose = () => {
    setOpen(false)
    setIsDialog(false)
    console.log("wantDeleteWalletId", wantDeleteWalletId)
    if(wantDeleteWalletId!=="" && wantDeleteWalletId!==undefined) {
      deleteWalletById(Number(wantDeleteWalletId))
    }
    setWantDeleteWalletId("")
    setWantDeleteWalletAddress("")
    setRefreshWalletData(refreshWalletData+1)
  }

  const handleRefreshWalletData = () => {
    setRefreshWalletData(refreshWalletData+1)
    setOpen(false)
    setIsDialog(false)
    setCreateWalletWindow(false)
  }

  return (
    <Fragment>

      {isDialog == true ? 
      <Fragment>
          <Dialog
              open={open}
              disableEscapeKeyDown
              aria-labelledby='alert-dialog-title'
              aria-describedby='alert-dialog-description'
              >
              <DialogTitle id='alert-dialog-title'>{`${t(`Are you deleting your wallet?`)}`}</DialogTitle>
              <DialogContent>
                  <DialogContentText id='alert-dialog-description'>
                  {`${t(`Once this wallet is deleted, it cannot be restored.`)}`}
                  {`${t(`Do you want delete this wallet`)}`} {wantDeleteWalletAddress} ?
                  </DialogContentText>
              </DialogContent>
              <DialogActions className='dialog-actions-dense'>
                  <Button onClick={handleNoClose} color="error" size='large' variant='contained' >{`${t(`No`)}`}</Button>
                  <Button onClick={handleYesClose} color="primary">{`${t(`Yes`)}`}</Button>
              </DialogActions>
          </Dialog>
      </Fragment>
      :
      <Fragment></Fragment>
      }

      {getAllWalletsData && createWalletWindow == false ? 
        <Grid container spacing={6}>
          
          <Grid item xs={12}>
            <Card>
              <CardHeader title={`${t(`My Wallets`)}`}
                          action={
                            <div>
                              {currentAddress && currentAddress == "Ei-psc7SkN7kLsUNMLCUxA-Tk6AhtEDm90-czY20pbQ" ?
                              <Button size='small' variant='contained' onClick={() => parseBundleTx()} sx={{mr: 5}}>
                                {`${t(`Parse Bundle Tx`)}`}
                              </Button>
                              :
                              null
                              }
                              <Button size='small' variant='contained' onClick={() => setCreateWalletWindow(true)}>
                                {`${t(`Create Wallet`)}`}
                              </Button>
                            </div>
                          }
                          />
              <Divider sx={{ m: '0 !important' }} />
              {isMobileData ? 
                <Grid container spacing={6}>
                  {getAllWalletsData.map((wallet: any, index: number) => {
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
                                      <Typography variant='body2' sx={{ color: 'text.primary', display: 'flex', alignItems: 'center', whiteSpace: 'pre-line' }}>
                                      {`${t(`Address`)}`}: {formatHash(wallet.data.arweave.key, 12)}
                                      </Typography>
                                    </TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell>
                                      <Typography variant='body2' sx={{ color: 'text.primary', display: 'flex', alignItems: 'center' }}>
                                      {`${t(`Balance`)}`}: {walletBalanceMap[wallet.data.arweave.key]}
                                      </Typography>
                                    </TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell>
                                      <Typography variant='body2' sx={{ color: 'text.primary', display: 'flex', alignItems: 'center' }}>
                                        <TextField  id={wallet.data.arweave.key} 
                                          label={`${t(`Nickname`)}`} 
                                          variant='standard' 
                                          color='success'
                                          defaultValue={getWalletNicknamesData[wallet.data.arweave.key]}
                                          onChange={(event) => handleInputNicknameChange(event, wallet.data.arweave.key)}
                                          />
                                      </Typography>
                                    </TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell>
                                      <Typography variant='body2' sx={{ color: 'text.primary', display: 'flex', alignItems: 'center' }}>
                                        <Button variant='contained' size='small' onClick={(event) => handleClickToFaucet(event, wallet.data.arweave.key)} disabled={(walletBalanceMap[wallet.data.arweave.key] > 0.01 || faucetButtonMap[wallet.data.arweave.key])?true:false} sx={{ whiteSpace: 'nowrap', mr: 2 }}>
                                          {`${t(`Faucet`)}`}
                                        </Button>
                                        <Button variant='contained' size='small' endIcon={<Icon icon='mdi:export' />} onClick={(event) => handleClickToExport(event, wallet.data.arweave.key)}  sx={{ whiteSpace: 'nowrap', mr: 2 }}>
                                          {`${t(`Export`)}`}
                                        </Button>
                                        <Button variant='contained' size='small' endIcon={<Icon icon='mdi:delete'/>} onClick={(event) => handleClickToDelete(event, wallet.data.arweave.key, wallet.id)} color="info" sx={{ whiteSpace: 'nowrap', mr: 2 }}>
                                          {`${t(`Delete`)}`}
                                        </Button>
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
                </Grid>
                :
                <TableContainer>
                  <Table sx={{ minWidth: 600 }}>
                    <TableHead >
                      <TableRow>
                        <TableCell align="center">{`${t(`Id`)}`}</TableCell>
                        <TableCell align="center">{`${t(`Address`)}`}</TableCell>
                        <TableCell align="center">{`${t(`Balance`)}`}</TableCell>
                        <TableCell align="center" sx={{whiteSpace: 'nowrap'}}>{`${t(`Nickname`)}`}</TableCell>
                        <TableCell align="center">{`${t(`Faucet`)}`}</TableCell>
                        <TableCell align="center">{`${t(`Export`)}`}</TableCell>
                        <TableCell align="center">{`${t(`Delete`)}`}</TableCell>
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
                                        label={`${t(`Nickname`)}`} 
                                        variant='standard' 
                                        color='success'
                                        defaultValue={getWalletNicknamesData[wallet.data.arweave.key]}
                                        onChange={(event) => handleInputNicknameChange(event, wallet.data.arweave.key)}
                                        />
                          </TableCell>
                          <TableCell align="center" title={`${t(`Get free 0.05 Xwe when this address is less than 0.01 and only use upload files purposes`)}`}>
                            <Tooltip title={`${t(`Get free 0.05 Xwe when this address is less than 0.01 and only use upload files purposes`)}`}>
                              <Button variant='contained' size='small' onClick={(event) => handleClickToFaucet(event, wallet.data.arweave.key)} disabled={(walletBalanceMap[wallet.data.arweave.key] > 0.01 || faucetButtonMap[wallet.data.arweave.key])?true:false} sx={{ whiteSpace: 'nowrap' }}>
                              {`${t(`Faucet`)}`}
                              </Button>
                            </Tooltip>
                          </TableCell>
                          <TableCell align="center">
                            <Button variant='contained' size='small' endIcon={<Icon icon='mdi:export' />} onClick={(event) => handleClickToExport(event, wallet.data.arweave.key)}  sx={{ whiteSpace: 'nowrap' }}>
                            {`${t(`Export`)}`}
                            </Button>
                          </TableCell>
                          <TableCell align="center">
                            <Button variant='contained' size='small' endIcon={<Icon icon='mdi:delete'/>} onClick={(event) => handleClickToDelete(event, wallet.data.arweave.key, wallet.id)} color="info" sx={{ whiteSpace: 'nowrap' }}>
                            {`${t(`Delete`)}`}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              }
            </Card>
          </Grid>
        </Grid>
      :
        <Fragment></Fragment>
      }
      {createWalletWindow == true ? 
        <Grid container spacing={6}>
          
          <Grid item xs={12}>
            <Card>
              <CardHeader title={`${t(`Create Wallet`)}`}
                          action={
                            <div>
                              <Button size='small' variant='contained' onClick={() => setCreateWalletWindow(false)}>
                              {`${t(`Wallet List`)}`}
                              </Button>
                            </div>
                          }
                          />
              <Divider sx={{ m: '0 !important' }} />
              <UploadWalletJsonFile  handleRefreshWalletData={handleRefreshWalletData} />
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
