// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import { Theme } from '@mui/material/styles'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const FooterContent = () => {
  // ** Var
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography sx={{ mr: 2 }}>
        {`© ${new Date().getFullYear()}, Made with `}
        <Box component='span' sx={{ color: 'error.main' }}>
          ❤️
        </Box>
        {` by `}
        <LinkStyled target='_blank' href='https://chivesweave.org/'>
        ChivesDrive
        </LinkStyled>
      </Typography>
      {hidden ? null : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', '& :not(:last-child)': { mr: 4 } }}>
          <LinkStyled target='_blank' href='https://github.com/chives-network/chivesweave'>
            Github
          </LinkStyled>
          <LinkStyled target='_blank' href='https://wallet.chivesweave.org/'>
            Web Wallet
          </LinkStyled>
          <LinkStyled target='_blank' href='https://web.aowallet.org/'>
            App Wallet
          </LinkStyled>
          <LinkStyled target='_blank' href='https://chromewebstore.google.com/detail/aowallet-arweave-wallet/dcgmbfihnfgaaokeogiadpgllidjnkgm?hl=en-US&utm_source=ext_sidebar'>
            Chrome Extension
          </LinkStyled>
          <LinkStyled target='_blank' href='https://play.google.com/store/apps/details?id=org.aowallet.app'>
            Google Play
          </LinkStyled>
        </Box>
      )}
    </Box>
  )
}

export default FooterContent
