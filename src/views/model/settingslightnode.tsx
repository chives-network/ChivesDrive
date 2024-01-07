// ** React Imports
import { useState, useEffect} from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'
import Typography from '@mui/material/Typography'

// ** Axios Imports
import axios from 'axios'
import authConfig from 'src/configs/auth'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Context
import { useAuth } from 'src/hooks/useAuth'

// ** Hooks
import { LightNodeSubmitToBlockchain, getWalletLightNode, chivesLightNodeUrl, getLockStatus, setLockStatus, checkNodeStatus, getWalletBalance } from 'src/functions/ChivesweaveWallets'

// ** Styled Component
import DropzoneWrapper from 'src/@core/styles/libs/react-dropzone'

// ** Third Party Components
import toast from 'react-hot-toast'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

import { useRouter } from 'next/router'


const LightNodeApp = () => {
  // ** Hook
  const { t } = useTranslation()

  const router = useRouter()

  // ** State
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  const [uploadingButton, setUploadingButton] = useState<string>(`${t('Submit')}`)
  const [isDisabledButton, setIsDisabledButton] = useState<boolean>(false)
  const [walletBalance, setWalletBalance] = useState<string>('')

  const auth = useAuth()
  const currentAddress = auth.currentAddress
  
  useEffect(() => {
    const handleWindowLoad = () => {
        setUploadingButton(`${t('Submit')}`)
        const getLockStatusData = getLockStatus("LightNode")
        if(getLockStatusData && getLockStatusData.length == 43) {
            setIsDisabledButton(true)
            setinputHostAndPort(`${t('Please wait for the blockchain to be packaged')}`)
            console.log("getLockStatusReferee 001",getLockStatusData)
        }
    };
    window.addEventListener('load', handleWindowLoad);

    return () => {
      window.removeEventListener('load', handleWindowLoad);
    };
  }, []);

  useEffect(() => {
    if(currentAddress && currentAddress.length == 43) {
        handleGetLightNode()
    }
  }, [currentAddress])

  const handleGetLightNode = async () => {
    const getWalletLightNodeData: any = await getWalletLightNode()
    console.log("getWalletLightNodeData", getWalletLightNodeData)
    const chivesLightNodeUrlData: any = await chivesLightNodeUrl(currentAddress)
    console.log("chivesLightNodeUrlData", chivesLightNodeUrlData)
    if(chivesLightNodeUrlData && chivesLightNodeUrlData.chivesLightNodeUrl) {
      setinputHostAndPort(chivesLightNodeUrlData.chivesLightNodeUrl)
      setIsDisabledButton(true)
    }
    else {
      setIsDisabledButton(false)
      setinputHostAndPort("")
    }
    
    const checkNodeStatusData: any = await checkNodeStatus()
    if(checkNodeStatusData == false) {
        setIsDisabledButton(true)
    }

    const Balance: string = await getWalletBalance(currentAddress)
    setWalletBalance(Balance)

  }

  const [inputHostAndPort, setinputHostAndPort] = useState<string>("")
  const [inputHostAndPortError, setinputHostAndPortError] = useState<string | null>(null)
  const inputHostAndPortHelpText = t("Please enter the external IP and port that your node can be accessed from the internet, such as http://112.170.68.77:1985 or https://xxx.xxx:1985. If the node is not accessible from the internet, you won't be able to receive rewards") as string
  const handleinputHostAndPortChange = (event: any) => {  
    setinputHostAndPort(event.target.value);
  };

  const handleSubmitToBlockchain = async () => {
    if(currentAddress == undefined || currentAddress == undefined || currentAddress.length != 43) {
        toast.success(t(`Please create a wallet first`), {
          duration: 4000
        })
        router.push("/mywallets");

        return
    }

    const getWalletLightNodeData: any = await getWalletLightNode()
    console.log("getWalletLightNodeData", getWalletLightNodeData)
    if(getWalletLightNodeData && getWalletLightNodeData.height && getWalletLightNodeData.blocks && getWalletLightNodeData.height <= getWalletLightNodeData.blocks) {
      //Synced
    }
    else {
      toast.error(`${t('Blockchain is currently syncing data. Please wait for a few hours before trying again')}`, {
        duration: 4000
      })

      return
    }

    //Check Url Format
    try {
      if(inputHostAndPort == "") {
        toast.error(`${t('Please enter your node url')}`, { duration: 3000 })
  
        return

      }
      const urlObject = new URL(inputHostAndPort);
      const host = urlObject.hostname;
      const port = urlObject.port;
      const protocol = urlObject.protocol;
      console.log("urlObject", urlObject)
      if( host && port && protocol) {
        setinputHostAndPort(protocol+"//"+host+":"+port);
      }
      else {
        toast.error(`${t('Invalid URL')}`, { duration: 3000 })
        setinputHostAndPortError(`${t('Invalid URL')}`)

        return
      }
    } 
    catch (error) {
      toast.error(`${t('Invalid URL')}`, { duration: 3000 })
      setinputHostAndPortError(`${t('Invalid URL')}`)

      return
    }

    //Check Url Availability
    const NodeAvailability: any = await axios.post(authConfig.checkNodeavAilability, {node: inputHostAndPort}).then(res=>res.data);
    console.log("NodeAvailability", NodeAvailability)
    if(NodeAvailability && NodeAvailability.height) {

      //Availability Passed
    }
    else {
      toast.error(`${t('Your entered URL is not accessible on the internet')}`, { duration: 3000 })

      return
    }

    //Submit
    setIsDisabledButton(true)
    setUploadingButton(`${t('Submitting...')}`)
    toast.success(`${t('Submitting...')}`, { duration: 3000 })

    const chivesLightNodeMap: any = {}
    chivesLightNodeMap['NodeApi'] = inputHostAndPort
    chivesLightNodeMap['Address'] = currentAddress
    const TxResult: any = await LightNodeSubmitToBlockchain(setUploadProgress, chivesLightNodeMap);

    //Save Tx Records Into LocalStorage
    const chivesTxStatus: string = authConfig.chivesTxStatus
    const ChivesDriveActionsMap: any = {}
    const chivesTxStatusText = window.localStorage.getItem(chivesTxStatus)      
    const chivesTxStatusList = chivesTxStatusText ? JSON.parse(chivesTxStatusText) : []
    chivesTxStatusList.push({TxResult,ChivesDriveActionsMap})
    console.log("chivesTxStatusList-LightNodeApp", chivesTxStatusList)
    window.localStorage.setItem(chivesTxStatus, JSON.stringify(chivesTxStatusList))
    setLockStatus('LightNode', TxResult.id as string)
    
    if(TxResult.status == 800) {
      //Insufficient balance
      toast.error(TxResult.statusText, { duration: 4000 })
      setIsDisabledButton(false)
      setUploadingButton(`${t('Submit')}`)
    }

  }

  useEffect(() => {
    let isFinishedAllUploaded = true
    uploadProgress && Object.entries(uploadProgress) && Object.entries(uploadProgress).forEach(([key, value]) => {
        if(value != 100) {
            isFinishedAllUploaded = false
        }
        
        console.log("uploadProgress key", key, value)
    })
    if(uploadProgress && Object.entries(uploadProgress) && Object.entries(uploadProgress).length > 0 && isFinishedAllUploaded) {
        setUploadingButton(`${t('Submit')}`)
        toast.success(`${t('Successfully submitted to blockchain')}`, { duration: 4000 })
    }
  }, [uploadProgress])

  return (
    <DropzoneWrapper>
      <Grid container spacing={6} className='match-height'>
        <Grid item xs={12}>
            <Card>
                <CardHeader title={`${t('Setting Chives Light Node Host And Port')}`} />
                <CardContent>
                    <Grid container spacing={5}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label={`${t('ChivesLightNode Address')}`}
                                placeholder={`${t('ChivesLightNode Address')}`}
                                value={currentAddress}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                        <Icon icon='bx:wallet' />
                                        </InputAdornment>
                                    )
                                }} 
                                disabled={true}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label={`${t('ChivesLightNode Balance')}`}
                                placeholder={`${t('ChivesLightNode Balance')}`}
                                value={walletBalance}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                        <Icon icon='clarity:wallet-solid' />
                                        </InputAdornment>
                                    )
                                }} 
                                disabled={true}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label={`${t('ChivesLightNodeHostAndPort')}`}
                                placeholder={`${t('ChivesLightNodeHostAndPort')}`}
                                value={inputHostAndPort}
                                onChange={handleinputHostAndPortChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                        <Icon icon='carbon:url' />
                                        </InputAdornment>
                                    )
                                }} 
                                disabled={isDisabledButton} 
                                error={!!inputHostAndPortError}
                                helperText={inputHostAndPortHelpText}
                            />
                        </Grid>

                        <Grid item xs={12} container justifyContent="flex-end">
                            <Button 
                                type='submit' 
                                variant='contained' 
                                size='small' 
                                onClick={handleSubmitToBlockchain} 
                                disabled={isDisabledButton} 
                                >
                                {uploadingButton}
                            </Button>
                        </Grid>

                        <Grid item xs={12} container>
                          <Typography sx={{ mb: 2 }}>{t('1. Each wallet can only submit a public URL once, and it cannot be modified after submission.') as string}</Typography>
                          <Typography sx={{ mb: 2 }}>{t('2. If you need to change the public URL, please switch to another wallet and then proceed with the binding.') as string}</Typography>
                          <Typography sx={{ mb: 2 }}>{t('3. The public URL must be accessible on the internet and can use either HTTP or HTTPS.') as string}</Typography>
                          <Typography sx={{ mb: 2 }}>{t('4. The format of the public URL is: `http://ip:port` or `https://domain:port`.') as string}</Typography>
                          <Typography sx={{ mb: 2 }}>{t('5. Wallet balance must not be less than 0.01 XWE. If there is no balance, you can use the faucet in the wallet management to obtain 0.05 XWE.') as string}</Typography>
                          <Typography sx={{ mb: 2 }}>{t('6. The wallet will generate a heartbeat every hour, requiring some GAS to complete.') as string}</Typography>
                          <Typography sx={{ mb: 2 }}>{t('7. Rewards will be distributed once daily.') as string}</Typography>
                        </Grid>

                    </Grid>
                </CardContent>
            </Card>
        </Grid>
      </Grid>
    </DropzoneWrapper>
  )
}


export default LightNodeApp
