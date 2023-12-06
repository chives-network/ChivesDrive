// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'
import Typography, { TypographyProps } from '@mui/material/Typography'

// ** Axios Imports
import authConfig from 'src/configs/auth'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Context
import { useAuth } from 'src/hooks/useAuth'

// ** Hooks
import { ProfileSubmitToBlockchain, getWalletProfile, getLockStatus, setLockStatus } from 'src/functions/ChivesweaveWallets'

// ** Styled Component
import DropzoneWrapper from 'src/@core/styles/libs/react-dropzone'

// ** Third Party Components
import toast from 'react-hot-toast'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

import { useRouter } from 'next/router'

// ** Third Party Imports
import { useDropzone } from 'react-dropzone'

interface FileProp {
    name: string
    type: string
    size: number
}

// Styled component for the upload image inside the dropzone area
const Img = styled('img')(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        marginRight: theme.spacing(15.75)
    },
    [theme.breakpoints.down('md')]: {
        marginBottom: theme.spacing(4)
    },
    [theme.breakpoints.down('sm')]: {
        width: 160
    }
}))

// Styled component for the heading inside the dropzone area
const HeadingTypography = styled(Typography)<TypographyProps>(({ theme }) => ({
    marginBottom: theme.spacing(5),
    [theme.breakpoints.down('sm')]: {
      marginBottom: theme.spacing(4)
    }
}))

const SendOutForm = () => {
  // ** Hook
  const { t } = useTranslation()

  const router = useRouter()

  // ** State
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  const [uploadingButton, setUploadingButton] = useState<string>(`${t('Save')}`)
  const [isDisabledButton, setIsDisabledButton] = useState<boolean>(false)
  const [avatarName, setAvatarName] = useState<string>("")
  const [avatarFilesUrl, setAvatarFilesUrl] = useState<string>('/images/avatars/1.png')
  const [bannerFilesUrl, setBannerFilesUrl] = useState<string>('/images/misc/upload.png')
  const [avatarFilesTxId, setAvatarFilesTxId] = useState<string>('')
  const [bannerFilesTxId, setBannerFilesTxId] = useState<string>('')

  const auth = useAuth()
  const currentAddress = auth.currentAddress
  const chivesProfile: string = authConfig.chivesProfile
  
  const [chivesProfileTxId, setChivesProfileTxId] = useState<string>("")
  useEffect(() => {
    setAvatarName(auth.currentAddress)
    const handleWindowLoad = () => {
        const getLockStatusData = getLockStatus("Profile")
        setChivesProfileTxId(getLockStatusData)
        if((chivesProfileTxId && chivesProfileTxId.length == 43) || (getLockStatusData && getLockStatusData.length == 43)) {
            setIsDisabledButton(true)
            setInputName(`${t('Please wait for the blockchain to be packaged')}`)
            setAvatarName(`${t('Please wait for the blockchain to be packaged')}`)
        }
    };
    window.addEventListener('load', handleWindowLoad);

    return () => {
      window.removeEventListener('load', handleWindowLoad);
    };
  }, []);

  useEffect(() => {
    handleGetProfile()
  }, [currentAddress])
  const handleGetProfile = async () => {
    const getWalletProfileData: any = await getWalletProfile(currentAddress)
    console.log("getWalletProfileData", getWalletProfileData)
    if(getWalletProfileData && getWalletProfileData['Name']) {
        setInputName(getWalletProfileData['Name']);
    }
    if(getWalletProfileData && getWalletProfileData['Email']) {
        setInputEmail(getWalletProfileData['Email']);
    }
    if(getWalletProfileData && getWalletProfileData['Twitter']) {
        setInputTwitter(getWalletProfileData['Twitter']);
    }
    if(getWalletProfileData && getWalletProfileData['Github']) {
        setInputGithub(getWalletProfileData['Github']);
    }
    if(getWalletProfileData && getWalletProfileData['Discord']) {
        setInputDiscord(getWalletProfileData['Discord']);
    }
    if(getWalletProfileData && getWalletProfileData['Instagram']) {
        setInputInstagram(getWalletProfileData['Instagram']);
    }
    if(getWalletProfileData && getWalletProfileData['Telegram']) {
        setInputTelegram(getWalletProfileData['Telegram']);
    }
    if(getWalletProfileData && getWalletProfileData['Medium']) {
        setInputMedium(getWalletProfileData['Medium']);
    }
    if(getWalletProfileData && getWalletProfileData['Reddit']) {
        setInputReddit(getWalletProfileData['Reddit']);
    }
    if(getWalletProfileData && getWalletProfileData['Youtube']) {
        setInputYoutube(getWalletProfileData['Youtube']);
    }
    if(getWalletProfileData && getWalletProfileData['Bio']) {
        setInputBio(getWalletProfileData['Bio']);
    }
    if(getWalletProfileData && getWalletProfileData['Avatar'] && getWalletProfileData['Avatar'].length == 43) {
        setAvatarFilesTxId(getWalletProfileData['Avatar']);
        setAvatarFilesUrl(authConfig.backEndApi + '/' + getWalletProfileData['Avatar']);
    }
    if(getWalletProfileData && getWalletProfileData['Banner'] && getWalletProfileData['Banner'].length == 43) {
        setBannerFilesTxId(getWalletProfileData['Banner']);
        setBannerFilesUrl(authConfig.backEndApi + '/' + getWalletProfileData['Banner']);
    }
  }

  
  const [inputName, setInputName] = useState<string>("")
  const [inputNameError, setInputNameError] = useState<string | null>(null)
  const handleInputNameChange = (event: any) => {
    setInputName(event.target.value);
    if(event.target.value.length < 3) {
        setInputNameError(`${t('Must be longer than 3 letters')}`)
    }
    else {
        setInputNameError("")
    }
  };

  const [inputEmail, setInputEmail] = useState<string>("")
  const [inputEmailError, setInputEmailError] = useState<string | null>(null)
  const handleInputEmailChange = (event: any) => {
    setInputEmail(event.target.value);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(event.target.value)) {
        setInputEmailError(`${t('Please enter the correct email')}`)
    }
    else {
        setInputEmailError("")
    }
  };

  const [inputTwitter, setInputTwitter] = useState<string>("")
  const [inputTwitterError, setInputTwitterError] = useState<string | null>(null)
  const handleInputTwitterChange = (event: any) => {
    setInputTwitter(event.target.value);
    if(event.target.value.length < 3) {
        setInputTwitterError(`${t('Must be longer than 3 letters')}`)
    }
    else {
        setInputTwitterError("")
    }
  };

  const [inputGithub, setInputGithub] = useState<string>("")
  const [inputGithubError, setInputGithubError] = useState<string | null>(null)
  const handleInputGithubChange = (event: any) => {
    setInputGithub(event.target.value);
    setInputGithubError("");
  };

  const [inputDiscord, setInputDiscord] = useState<string>("")
  const [inputDiscordError, setInputDiscordError] = useState<string | null>(null)
  const handleInputDiscordChange = (event: any) => {
    setInputDiscord(event.target.value);
    setInputDiscordError("");
  };

  const [inputInstagram, setInputInstagram] = useState<string>("")
  const [inputInstagramError, setInputInstagramError] = useState<string | null>(null)
  const handleInputInstagramChange = (event: any) => {
    setInputInstagram(event.target.value);
    setInputInstagramError("");
  };

  const [inputTelegram, setInputTelegram] = useState<string>("")
  const [inputTelegramError, setInputTelegramError] = useState<string | null>(null)
  const handleInputTelegramChange = (event: any) => {
    setInputTelegram(event.target.value);
    setInputTelegramError("");
  };

  const [inputMedium, setInputMedium] = useState<string>("")
  const [inputMediumError, setInputMediumError] = useState<string | null>(null)
  const handleInputMediumChange = (event: any) => {
    setInputMedium(event.target.value);
    setInputMediumError("");
  };

  const [inputReddit, setInputReddit] = useState<string>("")
  const [inputRedditError, setInputRedditError] = useState<string | null>(null)
  const handleInputRedditChange = (event: any) => {
    setInputReddit(event.target.value);
    setInputRedditError("");
  };

  const [inputYoutube, setInputYoutube] = useState<string>("")
  const [inputYoutubeError, setInputYoutubeError] = useState<string | null>(null)
  const handleInputYoutubeChange = (event: any) => {
    setInputYoutube(event.target.value);
    setInputYoutubeError("");
  };
  
  const [inputBio, setInputBio] = useState<string>("")
  const [inputBioError, setInputBioError] = useState<string | null>(null)
  const handleInputBioChange = (event: any) => {
    setInputBio(event.target.value);
    setInputBioError("")
  };

  // ** Hook
  const [avatarFiles, setAvatarFiles] = useState<File[]>([])
  const { getRootProps: getRootPropsAvatar, getInputProps: getInputPropsAvatar } = useDropzone({
    multiple: false,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    onDrop: (acceptedFiles: File[]) => {
        setAvatarFiles(acceptedFiles.map((file: File) => Object.assign(file)))
    }
  })

  // ** Hook
  const [bannerFiles, setBannerFiles] = useState<File[]>([])
  const { acceptedFiles, getRootProps: getRootPropsBanner, getInputProps: getInputPropsBanner } = useDropzone({
    multiple: false,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    onDrop: (acceptedFiles: File[]) => {
        setBannerFiles(acceptedFiles.map((file: File) => Object.assign(file)))
        console.log("bannerFiles",bannerFiles)
    }
  })    
  const BannerImageShow = bannerFiles&& bannerFiles.map((file: FileProp) => (
    <img key={file.name} alt={file.name} className='single-file-image' src={URL.createObjectURL(file as any)} />
  ))  

  const handleSubmitToBlockchain = async () => {
    if(currentAddress == undefined || currentAddress.length != 43) {
        toast.success(t(`Please create a wallet first`), {
          duration: 4000
        })
        router.push("/mywallets");

        return
    }
    
    setIsDisabledButton(true)
    setUploadingButton(`${t('Submitting...')}`)
    toast.success(`${t('Submitting...')}`, { duration: 3000 })

    const chivesProfileMap: any = {}
    chivesProfileMap['Name'] = inputName
    chivesProfileMap['Email'] = inputEmail
    chivesProfileMap['Twitter'] = inputTwitter
    chivesProfileMap['Github'] = inputGithub
    chivesProfileMap['Discord'] = inputDiscord
    chivesProfileMap['Instagram'] = inputInstagram
    chivesProfileMap['Telegram'] = inputTelegram
    chivesProfileMap['Medium'] = inputMedium
    chivesProfileMap['Reddit'] = inputReddit
    chivesProfileMap['Youtube'] = inputYoutube
    chivesProfileMap['Bio'] = inputBio
    chivesProfileMap['Avatar'] = avatarFiles
    chivesProfileMap['Banner'] = bannerFiles
    chivesProfileMap['AvatarTxId'] = avatarFilesTxId
    chivesProfileMap['BannerTxId'] = bannerFilesTxId

    const FileTxList: string[] = [];
    if(avatarFiles && avatarFiles[0]) {
        FileTxList.push('Avatar')
    }
    if(bannerFiles && bannerFiles[0]) {
        FileTxList.push('Banner')
    }
    FileTxList.push('Data')
    
    const TxResult: any = await ProfileSubmitToBlockchain(setUploadProgress, chivesProfileMap, FileTxList);

    //Save Tx Records Into LocalStorage
    const chivesTxStatus: string = authConfig.chivesTxStatus
    const ChivesDriveActionsMap: any = {}
    const chivesTxStatusText = window.localStorage.getItem(chivesTxStatus)      
    const chivesTxStatusList = chivesTxStatusText ? JSON.parse(chivesTxStatusText) : []
    chivesTxStatusList.push({TxResult,ChivesDriveActionsMap})
    console.log("chivesTxStatusList-SendOutForm", chivesTxStatusList)
    window.localStorage.setItem(chivesTxStatus, JSON.stringify(chivesTxStatusList))
    setLockStatus('Profile', TxResult.id as string)
    setAvatarName(`${t('Please wait for the blockchain to be packaged')}`)
    
    if(TxResult.status == 800) {
      //Insufficient balance
      toast.error(TxResult.statusText, { duration: 4000 })
      setIsDisabledButton(false)
      setUploadingButton(`${t('Submit')}`)
      setChivesProfileTxId(TxResult.id)
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
        
        /*
        setIsDisabledButton(false)
        setInputName("")
        setInputEmail("")
        setInputTwitter("")
        setInputGithub("")
        setInputDiscord("")
        setInputInstagram("")
        setInputTelegram("")
        setInputMedium("")
        setInputReddit("")
        setInputYoutube("")
        setInputBio("")
        */

        toast.success(`${t('Successfully submitted to blockchain')}`, { duration: 4000 })
    }
  }, [uploadProgress])

  return (
    <DropzoneWrapper>
      <Grid container spacing={6} className='match-height'>
        <Grid item xs={12}>
            <Card>
                <CardHeader title={`${t('Profile')}`} />
                <CardContent>
                    <Grid container spacing={5}>
                        <Grid item xs={12}>
                            <CardContent sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                                <Fragment>
                                    {isDisabledButton ?
                                    <Fragment>
                                        {avatarFiles && avatarFiles.length ? (
                                            <Box  sx={{ alignItems: 'center'}}>
                                                <Img alt='Upload Avatar' src={URL.createObjectURL(avatarFiles[0] as any)}  sx={{width: '200px', height: '200px', borderRadius: '5px'}}/>
                                            </Box>
                                        ) : (
                                            <Box sx={{alignItems: 'center'}}>
                                                <Img alt='Upload Avatar' src={avatarFilesUrl} sx={{width: '200px', height: '200px', borderRadius: '5px'}}/>
                                            </Box>
                                        )}
                                    </Fragment>
                                    :
                                    <Box {...getRootPropsAvatar({ className: 'dropzone' })} sx={{width: '200px', height: '200px'}}>
                                        <input {...getInputPropsAvatar()} />
                                        {avatarFiles && avatarFiles.length ? (
                                            <Box  sx={{ alignItems: 'center'}}>
                                                <Img alt='Upload Avatar' src={URL.createObjectURL(avatarFiles[0] as any)} sx={{width: '100%', borderRadius: '5px'}}/>
                                            </Box>
                                        ) : (
                                            <Box sx={{alignItems: 'center'}}>
                                                <Img alt='Upload Avatar' src={avatarFilesUrl} sx={{width: '100%', borderRadius: '5px'}}/>
                                            </Box>
                                        )}
                                    </Box>
                                    }
                                </Fragment>
                                <Typography sx={{ mt: 3 }}>
                                    {avatarName}
                                </Typography>
                            </CardContent>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label={`${t('Name')}`}
                                placeholder={`${t('Name')}`}
                                value={inputName}
                                onChange={handleInputNameChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                        <Icon icon='mdi:account-outline' />
                                        </InputAdornment>
                                    )
                                }}
                                disabled={isDisabledButton} 
                                error={!!inputNameError}
                                helperText={inputNameError}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label={`${t('Email')}`}
                                placeholder={`${t('Email')}`}
                                value={inputEmail}
                                onChange={handleInputEmailChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                        <Icon icon='mdi:email-outline' />
                                        </InputAdornment>
                                    )
                                }}
                                disabled={isDisabledButton} 
                                error={!!inputEmailError}
                                helperText={inputEmailError}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label={`${t('Twitter')}`}
                                placeholder={`${t('Twitter')}`}
                                value={inputTwitter}
                                onChange={handleInputTwitterChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                        <Icon icon='mdi:twitter' />
                                        </InputAdornment>
                                    )
                                }}
                                disabled={isDisabledButton} 
                                error={!!inputTwitterError}
                                helperText={inputTwitterError}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label={`${t('Github')}`}
                                placeholder={`${t('Github')}`}
                                value={inputGithub}
                                onChange={handleInputGithubChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                        <Icon icon='mdi:github' />
                                        </InputAdornment>
                                    )
                                }}
                                disabled={isDisabledButton} 
                                error={!!inputGithubError}
                                helperText={inputGithubError}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label={`${t('Discord')}`}
                                placeholder={`${t('Discord')}`}
                                value={inputDiscord}
                                onChange={handleInputDiscordChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                        <Icon icon='mdi:discord' />
                                        </InputAdornment>
                                    )
                                }}
                                disabled={isDisabledButton} 
                                error={!!inputDiscordError}
                                helperText={inputDiscordError}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label={`${t('Instagram')}`}
                                placeholder={`${t('Instagram')}`}
                                value={inputInstagram}
                                onChange={handleInputInstagramChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                        <Icon icon='mdi:instagram' />
                                        </InputAdornment>
                                    )
                                }}
                                disabled={isDisabledButton} 
                                error={!!inputInstagramError}
                                helperText={inputInstagramError}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label={`${t('Telegram')}`}
                                placeholder={`${t('Telegram')}`}
                                value={inputTelegram}
                                onChange={handleInputTelegramChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                        <Icon icon='mdi:telegram' />
                                        </InputAdornment>
                                    )
                                }}
                                disabled={isDisabledButton} 
                                error={!!inputTelegramError}
                                helperText={inputTelegramError}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label={`${t('Medium')}`}
                                placeholder={`${t('Medium')}`}
                                value={inputMedium}
                                onChange={handleInputMediumChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                        <Icon icon='mdi:medium' />
                                        </InputAdornment>
                                    )
                                }}
                                disabled={isDisabledButton} 
                                error={!!inputMediumError}
                                helperText={inputMediumError}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label={`${t('Reddit')}`}
                                placeholder={`${t('Reddit')}`}
                                value={inputReddit}
                                onChange={handleInputRedditChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                        <Icon icon='mdi:reddit' />
                                        </InputAdornment>
                                    )
                                }}
                                disabled={isDisabledButton} 
                                error={!!inputRedditError}
                                helperText={inputRedditError}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label={`${t('Youtube')}`}
                                placeholder={`${t('Youtube')}`}
                                value={inputYoutube}
                                onChange={handleInputYoutubeChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                        <Icon icon='mdi:youtube' />
                                        </InputAdornment>
                                    )
                                }}
                                disabled={isDisabledButton} 
                                error={!!inputYoutubeError}
                                helperText={inputYoutubeError}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                minRows={3}
                                label={`${t('Bio')}`}
                                placeholder={`${t('Describe yourself')}`}
                                sx={{ '& .MuiOutlinedInput-root': { alignItems: 'baseline' } }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                        <Icon icon='mdi:message-outline' />
                                        </InputAdornment>
                                    )
                                }}
                                disabled={isDisabledButton} 
                                value={inputBio}
                                onChange={handleInputBioChange}
                                error={!!inputBioError}
                                helperText={inputBioError}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Fragment>
                                {isDisabledButton ?
                                <Fragment>
                                    {bannerFiles && bannerFiles.length ? (
                                        <Box  sx={{ alignItems: 'center'}}>
                                            <Img alt='Upload Banner' src={URL.createObjectURL(bannerFiles[0] as any)} sx={{height: '160px', borderRadius: '5px'}}/>
                                        </Box>
                                    ) : (
                                        <Box sx={{alignItems: 'center'}}>
                                            <Img alt='Upload Banner' src={bannerFilesUrl}/>
                                        </Box>
                                    )}
                                </Fragment>
                                :
                                <Box {...getRootPropsBanner({ className: 'dropzone' })} sx={acceptedFiles.length ? {} : {}}>
                                    <input {...getInputPropsBanner()} />
                                    {bannerFiles && bannerFiles.length ? (
                                        BannerImageShow
                                    ) : (
                                        <Box sx={{ display: 'flex', flexDirection: ['column', 'column', 'row'], alignItems: 'center' }}>
                                            <Img alt='Upload img' src={bannerFilesUrl} sx={{height: '160px', borderRadius: '5px'}}/>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: ['center', 'center', 'inherit'] }}>
                                                <HeadingTypography variant='h5'>{`${t(`Upload banner image`)}`}</HeadingTypography>
                                            </Box>
                                        </Box>
                                    )}
                                </Box>
                                }
                            </Fragment>
                        </Grid>

                        <Grid item xs={12} container justifyContent="flex-end">
                            <Button 
                                type='submit' 
                                variant='contained' 
                                size='large' 
                                onClick={handleSubmitToBlockchain} 
                                disabled={isDisabledButton} 
                                >
                                {uploadingButton}
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Grid>
      </Grid>
    </DropzoneWrapper>
  )
}

/*
                
                */
export default SendOutForm
