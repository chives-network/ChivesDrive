// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Select from '@mui/material/Select'
import Switch from '@mui/material/Switch'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import InputAdornment from '@mui/material/InputAdornment'
import LinearProgress from '@mui/material/LinearProgress'
import FormControlLabel from '@mui/material/FormControlLabel'
import DialogContentText from '@mui/material/DialogContentText'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import UserSuspendDialog from 'src/views/agent/UserSuspendDialog'
import UserSubscriptionDialog from 'src/views/agent/UserSubscriptionDialog'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'
import { UsersType } from 'src/types/apps/userTypes'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Hooks
import { ProfileSubmitToBlockchain, getWalletProfile, getLockStatus, setLockStatus } from 'src/functions/ChivesweaveWallets'
import { useAuth } from 'src/hooks/useAuth'
import authConfig from 'src/configs/auth'
import { useTranslation } from 'react-i18next'


interface ColorsType {
  [key: string]: ThemeColor
}

const data: UsersType = {
  id: 1,
  role: 'admin',
  status: 'active',
  username: 'gslixby0',
  avatarColor: 'primary',
  country: 'El Salvador',
  company: 'Yotz PVT LTD',
  contact: '(479) 232-9151',
  currentPlan: 'enterprise',
  fullName: 'Daisy Patterson',
  email: 'gslixby0@abc.net.au',
  avatar: '/images/avatars/4.png'
}

const roleColors: ColorsType = {
  admin: 'error',
  editor: 'info',
  author: 'warning',
  maintainer: 'success',
  subscriber: 'primary'
}

// ** Styled <sup> component
const Sup = styled('sup')(({ theme }) => ({
  top: '0.2rem',
  left: '-0.6rem',
  position: 'absolute',
  color: theme.palette.primary.main
}))

// ** Styled <sub> component
const Sub = styled('sub')({
  fontWeight: 300,
  fontSize: '1rem',
  alignSelf: 'flex-end'
})

const UserViewLeft = () => {
  // ** States
  const [openPlans, setOpenPlans] = useState<boolean>(false)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState<boolean>(false)
  const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState<boolean>(false)

  // Handle Upgrade Plan dialog
  const handlePlansClickOpen = () => setOpenPlans(true)
  const handlePlansClose = () => setOpenPlans(false)

  const auth = useAuth()
  const currentAddress = auth.currentAddress
  
  const { t } = useTranslation()

  const LevelName = ['InActive', 'Level 1', 'Level 2', 'Level 3'];

  useEffect(() => {
    if(currentAddress && currentAddress.length == 43) {
        handleGetProfile()
    }
  }, [currentAddress])

  const [inputName, setInputName] = useState<string>("")
  const [inputEmail, setInputEmail] = useState<string>("")
  const [inputTwitter, setInputTwitter] = useState<string>("")
  const [inputGithub, setInputGithub] = useState<string>("")
  const [inputDiscord, setInputDiscord] = useState<string>("")
  const [inputInstagram, setInputInstagram] = useState<string>("")
  const [inputTelegram, setInputTelegram] = useState<string>("")
  const [inputMedium, setInputMedium] = useState<string>("")
  const [inputReddit, setInputReddit] = useState<string>("")
  const [inputYoutube, setInputYoutube] = useState<string>("")
  const [inputBio, setInputBio] = useState<string>("")
  const [avatarFilesUrl, setAvatarFilesUrl] = useState<string>('/images/avatars/1.png')
  const [bannerFilesUrl, setBannerFilesUrl] = useState<string>('/images/misc/upload.png')
  const [agentLevel, setAgentLevel] = useState<string>("")
  
  const handleGetProfile = async () => {
    const getWalletProfileData: any = await getWalletProfile(currentAddress)
    console.log("getWalletProfileData", getWalletProfileData)
    if(getWalletProfileData && getWalletProfileData['Profile'] && getWalletProfileData['Profile']['Name']) {
        setInputName(getWalletProfileData['Profile']['Name']);
    }
    if(getWalletProfileData && getWalletProfileData['Profile'] && getWalletProfileData['Profile']['Email']) {
        setInputEmail(getWalletProfileData['Profile']['Email']);
    }
    if(getWalletProfileData && getWalletProfileData['Profile'] && getWalletProfileData['Profile']['Twitter']) {
        setInputTwitter(getWalletProfileData['Profile']['Twitter']);
    }
    if(getWalletProfileData && getWalletProfileData['Profile'] && getWalletProfileData['Profile']['Github']) {
        setInputGithub(getWalletProfileData['Profile']['Github']);
    }
    if(getWalletProfileData && getWalletProfileData['Profile'] && getWalletProfileData['Profile']['Discord']) {
        setInputDiscord(getWalletProfileData['Profile']['Discord']);
    }
    if(getWalletProfileData && getWalletProfileData['Profile'] && getWalletProfileData['Profile']['Instagram']) {
        setInputInstagram(getWalletProfileData['Profile']['Instagram']);
    }
    if(getWalletProfileData && getWalletProfileData['Profile'] && getWalletProfileData['Profile']['Telegram']) {
        setInputTelegram(getWalletProfileData['Profile']['Telegram']);
    }
    if(getWalletProfileData && getWalletProfileData['Profile'] && getWalletProfileData['Profile']['Medium']) {
        setInputMedium(getWalletProfileData['Profile']['Medium']);
    }
    if(getWalletProfileData && getWalletProfileData['Profile'] && getWalletProfileData['Profile']['Reddit']) {
        setInputReddit(getWalletProfileData['Profile']['Reddit']);
    }
    if(getWalletProfileData && getWalletProfileData['Profile'] && getWalletProfileData['Profile']['Youtube']) {
        setInputYoutube(getWalletProfileData['Profile']['Youtube']);
    }
    if(getWalletProfileData && getWalletProfileData['Profile'] && getWalletProfileData['Profile']['Bio']) {
        setInputBio(getWalletProfileData['Profile']['Bio']);
    }
    if(getWalletProfileData && getWalletProfileData['Profile'] && getWalletProfileData['Profile']['Avatar'] && getWalletProfileData['Profile']['Avatar'].length == 43) {
        setAvatarFilesUrl(authConfig.backEndApi + '/' + getWalletProfileData['Profile']['Avatar']);
    }
    if(getWalletProfileData && getWalletProfileData['Profile'] && getWalletProfileData['Profile']['Banner'] && getWalletProfileData['Profile']['Banner'].length == 43) {
        setBannerFilesUrl(authConfig.backEndApi + '/' + getWalletProfileData['Profile']['Banner']);
    }
    if(getWalletProfileData && getWalletProfileData['AgentLevel']) {
      setAgentLevel(getWalletProfileData['AgentLevel']);
    }
  }
  
  if (data) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ pt: 15, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              {avatarFilesUrl.length ? (
                <CustomAvatar
                  src={avatarFilesUrl}
                  variant='rounded'
                  alt={inputName}
                  sx={{ width: 120, height: 120, fontWeight: 600, mb: 4, fontSize: '3rem' }}
                />
              ) : (
                <CustomAvatar
                  skin='light'
                  variant='rounded'
                  color={data.avatarColor as ThemeColor}
                  sx={{ width: 120, height: 120, fontWeight: 600, mb: 4, fontSize: '3rem' }}
                >
                  {getInitials(inputName)}
                </CustomAvatar>
              )}
              <Typography variant='h6' sx={{ mb: 4 }}>
                {inputName}
              </Typography>
              <CustomChip
                skin='light'
                size='small'
                label={LevelName[Number(agentLevel)]}
                color={'error'}
                sx={{ textTransform: 'capitalize' }}
              />
            </CardContent>

            <CardContent sx={{ my: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box sx={{ mr: 8, display: 'flex', alignItems: 'center' }}>
                  <CustomAvatar skin='light' variant='rounded' sx={{ mr: 4, width: 44, height: 44 }}>
                    <Icon icon='mdi:check' />
                  </CustomAvatar>
                  <div>
                    <Typography variant='h6'>1.23k</Typography>
                    <Typography variant='body2'>Task Done</Typography>
                  </div>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CustomAvatar skin='light' variant='rounded' sx={{ mr: 4, width: 44, height: 44 }}>
                    <Icon icon='mdi:star-outline' />
                  </CustomAvatar>
                  <div>
                    <Typography variant='h6'>568</Typography>
                    <Typography variant='body2'>Project Done</Typography>
                  </div>
                </Box>
              </Box>
            </CardContent>

            <CardContent>
              <Typography variant='h6'>{`${t(`Profile`)}`}</Typography>
              <Divider sx={{ my: theme => `${theme.spacing(4)} !important` }} />
              <Box sx={{ pb: 1 }}>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>{`${t(`Name`)}`}:</Typography>
                  <Typography variant='body2'>{inputName}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>{`${t(`Email`)}`}:</Typography>
                  <Typography variant='body2'>{inputEmail}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>{`${t(`Twitter`)}`}:</Typography>
                  <Typography variant='body2'>{inputTwitter}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>{`${t(`Github`)}`}:</Typography>
                  <Typography variant='body2'>{inputGithub}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>{`${t(`Discord`)}`}:</Typography>
                  <Typography variant='body2'>{inputDiscord}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>{`${t(`Instagram`)}`}:</Typography>
                  <Typography variant='body2'>{inputInstagram}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>{`${t(`Telegram`)}`}:</Typography>
                  <Typography variant='body2'>{inputTelegram}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>{`${t(`Medium`)}`}:</Typography>
                  <Typography variant='body2'>{inputMedium}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>{`${t(`Reddit`)}`}:</Typography>
                  <Typography variant='body2'>{inputReddit}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>{`${t(`Youtube`)}`}:</Typography>
                  <Typography variant='body2'>{inputYoutube}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>{`${t(`Bio`)}`}:</Typography>
                  <Typography variant='body2'>{inputBio}</Typography>
                </Box>
              </Box>
            </CardContent>

            <UserSubscriptionDialog open={subscriptionDialogOpen} setOpen={setSubscriptionDialogOpen} />
          </Card>
        </Grid>

      </Grid>
    )
  } else {
    return null
  }
}

export default UserViewLeft
