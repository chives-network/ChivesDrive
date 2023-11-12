// ** React Imports
import { ElementType, ReactNode, useState, useEffect } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ListItem, { ListItemProps } from '@mui/material/ListItem'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// ** Custom Components Imports
import CustomBadge from 'src/@core/components/mui/badge'

// ** Types
import { CustomBadgeProps } from 'src/@core/components/mui/badge/types'
import { DriveFolderType, DriveLabelType, DriveSidebarType } from 'src/types/apps/Chivesweave'

// ** Styled Components
const ListItemStyled = styled(ListItem)<ListItemProps & { component?: ElementType; href: string }>(({ theme }) => ({
  borderLeftWidth: '3px',
  borderLeftStyle: 'solid',
  padding: theme.spacing(0, 5),
  marginBottom: theme.spacing(1)
}))

const ListBadge = styled(CustomBadge)<CustomBadgeProps>(() => ({
  '& .MuiBadge-badge': {
    height: '18px',
    minWidth: '18px',
    transform: 'none',
    position: 'relative',
    transformOrigin: 'none'
  }
}))

const SidebarLeft = (props: DriveSidebarType) => {
  // ** Props
  const {
    store,
    hidden,
    lgAbove,
    dispatch,
    routeParams,
    leftSidebarOpen,
    leftSidebarWidth,
    toggleComposeOpen,
    setMailDetailsOpen,
    handleSelectAllMail,
    handleLeftSidebarToggle
  } = props

  const [sideBarActive, setSideBarActive] = useState<{ [key: string]: string }>({"folder": "myfiles"})

  const [sideBarBadge, setSideBarBadge] = useState<{ [key: string]: string }>({"folder": ""})

  useEffect(() => {
    if(routeParams && routeParams.folder) {
      setSideBarActive({"folder": routeParams.folder})
    }
    if(store && store.total && routeParams && routeParams.folder) {
      setSideBarBadge({...sideBarBadge, [routeParams.folder]: store.total})
    }
    console.log("sideBarBadge", sideBarBadge)
  }, [routeParams, store])

  const RenderBadge = (
    folder: 'myfiles' | 'draft' | 'spam' | 'starred' | 'sharedfiles' | 'uploaded' | 'trash',
    color: 'default' | 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'
  ) => {
    if (store && store.total > 0) {
      return <ListBadge skin='light' color={color} sx={{ ml: 2 }} badgeContent={store.total} />
    } else {
      return null
    }
  }

  const handleActiveItem = (type: 'folder' | 'label' | 'type', value: string) => {
    if (sideBarActive && sideBarActive[type] !== value) {
      return false
    } else {
      return true
    }
  }

  const handleListItemClick = () => {
    setMailDetailsOpen(false)
    setTimeout(() => dispatch(handleSelectAllMail(false)), 50)
    handleLeftSidebarToggle()
  }

  const activemyfilesCondition =
    store && handleActiveItem('folder', 'myfiles')

  const ScrollWrapper = ({ children }: { children: ReactNode }) => {
    if (hidden) {
      return <Box sx={{ height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>{children}</Box>
    } else {
      return <PerfectScrollbar options={{ wheelPropagation: false }}>{children}</PerfectScrollbar>
    }
  }

  return (
    <Drawer
      open={leftSidebarOpen}
      onClose={handleLeftSidebarToggle}
      variant={lgAbove ? 'permanent' : 'temporary'}
      ModalProps={{
        disablePortal: true,
        keepMounted: true // Better open performance on mobile.
      }}
      sx={{
        zIndex: 9,
        display: 'block',
        position: lgAbove ? 'static' : 'absolute',
        '& .MuiDrawer-paper': {
          boxShadow: 'none',
          width: leftSidebarWidth,
          zIndex: lgAbove ? 2 : 'drawer',
          position: lgAbove ? 'static' : 'absolute'
        },
        '& .MuiBackdrop-root': {
          position: 'absolute'
        }
      }}
    >
      <Box sx={{ p: 5, overflowY: 'hidden' }}>
        <Button fullWidth variant='contained' onClick={toggleComposeOpen}>
          Upload Files
        </Button>
      </Box>
      <ScrollWrapper>
        <Box sx={{ pt: 0, overflowY: 'hidden' }}>
          <List component='div'>
            <ListItemStyled
              component={Link}
              href='/drive/myfiles'
              onClick={handleListItemClick}
              sx={{ borderLeftColor: activemyfilesCondition ? 'primary.main' : 'transparent' }}
            >
              <ListItemIcon sx={{ color: activemyfilesCondition ? 'primary.main' : 'text.secondary' }}>
                <Icon icon='mdi:email-outline' />
              </ListItemIcon>
              <ListItemText
                primary='My Files'
                primaryTypographyProps={{
                  noWrap: true,
                  sx: { fontWeight: 500, ...(activemyfilesCondition && { color: 'primary.main' }) }
                }}
              />
              {RenderBadge('myfiles', 'primary')}
            </ListItemStyled>
            <ListItemStyled
              component={Link}
              href='/drive/sharedfiles'
              onClick={handleListItemClick}
              sx={{
                borderLeftColor: handleActiveItem('folder', 'sharedfiles') ? 'primary.main' : 'transparent'
              }}
            >
              <ListItemIcon
                sx={{
                  color: handleActiveItem('folder', 'sharedfiles') ? 'primary.main' : 'text.secondary'
                }}
              >
                <Icon icon='mdi:send-outline' />
              </ListItemIcon>
              <ListItemText
                primary='Shared Files'
                primaryTypographyProps={{
                  noWrap: true,
                  sx: { fontWeight: 500, ...(handleActiveItem('folder', 'sharedfiles') && { color: 'primary.main' }) }
                }}
              />
              {RenderBadge('sharedfiles', 'warning')}
            </ListItemStyled>
            <ListItemStyled
              component={Link}
              href='/drive/uploaded'
              onClick={handleListItemClick}
              sx={{
                borderLeftColor: handleActiveItem('folder', 'uploaded') ? 'primary.main' : 'transparent'
              }}
            >
              <ListItemIcon
                sx={{
                  color: handleActiveItem('folder', 'uploaded') ? 'primary.main' : 'text.secondary'
                }}
              >
                <Icon icon='mdi:pencil-outline' />
              </ListItemIcon>
              <ListItemText
                primary='Uploaded'
                primaryTypographyProps={{
                  noWrap: true,
                  sx: { fontWeight: 500, ...(handleActiveItem('folder', 'uploaded') && { color: 'primary.main' }) }
                }}
              />
              {RenderBadge('uploaded', 'secondary')}
            </ListItemStyled>
            <ListItemStyled
              component={Link}
              href='/drive/starred'
              onClick={handleListItemClick}
              sx={{
                borderLeftColor: handleActiveItem('folder', 'starred') ? 'primary.main' : 'transparent'
              }}
            >
              <ListItemIcon
                sx={{
                  color: handleActiveItem('folder', 'starred') ? 'primary.main' : 'text.secondary'
                }}
              >
                <Icon icon='mdi:star-outline' />
              </ListItemIcon>
              <ListItemText
                primary='Starred'
                primaryTypographyProps={{
                  noWrap: true,
                  sx: { fontWeight: 500, ...(handleActiveItem('folder', 'starred') && { color: 'primary.main' }) }
                }}
              />
              {RenderBadge('starred', 'success')}
            </ListItemStyled>
            <ListItemStyled
              component={Link}
              href='/drive/spam'
              onClick={handleListItemClick}
              sx={{
                borderLeftColor: handleActiveItem('folder', 'spam') ? 'primary.main' : 'transparent'
              }}
            >
              <ListItemIcon
                sx={{
                  color: handleActiveItem('folder', 'spam') ? 'primary.main' : 'text.secondary'
                }}
              >
                <Icon icon='mdi:alert-octagon-outline' />
              </ListItemIcon>
              <ListItemText
                primary='Spam'
                primaryTypographyProps={{
                  noWrap: true,
                  sx: { fontWeight: 500, ...(handleActiveItem('folder', 'spam') && { color: 'primary.main' }) }
                }}
              />
              {RenderBadge('spam', 'error')}
            </ListItemStyled>
            <ListItemStyled
              component={Link}
              href='/drive/trash'
              onClick={handleListItemClick}
              sx={{
                borderLeftColor: handleActiveItem('folder', 'trash') ? 'primary.main' : 'transparent'
              }}
            >
              <ListItemIcon
                sx={{
                  color: handleActiveItem('folder', 'trash') ? 'primary.main' : 'text.secondary'
                }}
              >
                <Icon icon='mdi:delete-outline' />
              </ListItemIcon>
              <ListItemText
                primary='Trash'
                primaryTypographyProps={{
                  noWrap: true,
                  sx: { fontWeight: 500, ...(handleActiveItem('folder', 'trash') && { color: 'primary.main' }) }
                }}
              />
              {RenderBadge('trash', 'info')}
            </ListItemStyled>
          </List>
          <Typography
            component='h6'
            variant='caption'
            sx={{ mx: 6, mt: 4, mb: 0, color: 'text.disabled', letterSpacing: '0.21px', textTransform: 'uppercase' }}
          >
            File Types
          </Typography>
          <List component='div'>
            <ListItemStyled
              component={Link}
              href='/drive/png'
              onClick={handleListItemClick}
              sx={{
                borderLeftColor: handleActiveItem('type', 'png') ? 'primary.main' : 'transparent'
              }}
            >
              <ListItemIcon sx={{ mr: 3.5, '& svg': { color: 'success.main' } }}>
                <Icon icon='mdi:circle' fontSize='0.75rem' />
              </ListItemIcon>
              <ListItemText
                primary='Png'
                primaryTypographyProps={{
                  noWrap: true,
                  sx: { fontWeight: 500, ...(handleActiveItem('type', 'png') && { color: 'primary.main' }) }
                }}
              />
            </ListItemStyled>
            <ListItemStyled
              component={Link}
              href='/drive/jpeg'
              onClick={handleListItemClick}
              sx={{
                borderLeftColor: handleActiveItem('type', 'jpeg') ? 'primary.main' : 'transparent'
              }}
            >
              <ListItemIcon sx={{ mr: 3.5, '& svg': { color: 'primary.main' } }}>
                <Icon icon='mdi:circle' fontSize='0.75rem' />
              </ListItemIcon>
              <ListItemText
                primary='Jpeg'
                primaryTypographyProps={{
                  noWrap: true,
                  sx: { fontWeight: 500, ...(handleActiveItem('type', 'jpeg') && { color: 'primary.main' }) }
                }}
              />
            </ListItemStyled>
            <ListItemStyled
              component={Link}
              href='/drive/mp4'
              onClick={handleListItemClick}
              sx={{
                borderLeftColor: handleActiveItem('type', 'mp4') ? 'primary.main' : 'transparent'
              }}
            >
              <ListItemIcon sx={{ mr: 3.5, '& svg': { color: 'warning.main' } }}>
                <Icon icon='mdi:circle' fontSize='0.75rem' />
              </ListItemIcon>
              <ListItemText
                primary='Video Mp4'
                primaryTypographyProps={{
                  noWrap: true,
                  sx: { fontWeight: 500, ...(handleActiveItem('type', 'mp4') && { color: 'primary.main' }) }
                }}
              />
            </ListItemStyled>
            <ListItemStyled
              component={Link}
              href='/drive/pdf'
              onClick={handleListItemClick}
              sx={{
                borderLeftColor: handleActiveItem('type', 'pdf') ? 'primary.main' : 'transparent'
              }}
            >
              <ListItemIcon sx={{ mr: 3.5, '& svg': { color: 'error.main' } }}>
                <Icon icon='mdi:circle' fontSize='0.75rem' />
              </ListItemIcon>
              <ListItemText
                primary='Pdf'
                primaryTypographyProps={{
                  noWrap: true,
                  sx: { fontWeight: 500, ...(handleActiveItem('type', 'pdf') && { color: 'primary.main' }) }
                }}
              />
            </ListItemStyled>
            <ListItemStyled
              component={Link}
              href='/drive/office'
              onClick={handleListItemClick}
              sx={{
                borderLeftColor: handleActiveItem('type', 'office') ? 'warning.main' : 'transparent'
              }}
            >
              <ListItemIcon sx={{ mr: 3.5, '& svg': { color: 'warning.main' } }}>
                <Icon icon='mdi:circle' fontSize='0.75rem' />
              </ListItemIcon>
              <ListItemText
                primary='Office'
                primaryTypographyProps={{
                  noWrap: true,
                  sx: { fontWeight: 500, ...(handleActiveItem('type', 'office') && { color: 'warning.main' }) }
                }}
              />
            </ListItemStyled>
            <ListItemStyled
              component={Link}
              href='/drive/stl'
              onClick={handleListItemClick}
              sx={{
                borderLeftColor: handleActiveItem('type', 'stl') ? 'info.main' : 'transparent'
              }}
            >
              <ListItemIcon sx={{ mr: 3.5, '& svg': { color: 'info.info' } }}>
                <Icon icon='mdi:circle' fontSize='0.75rem' />
              </ListItemIcon>
              <ListItemText
                primary='Stl'
                primaryTypographyProps={{
                  noWrap: true,
                  sx: { fontWeight: 500, ...(handleActiveItem('type', 'stl') && { color: 'info.main' }) }
                }}
              />
            </ListItemStyled>
          </List>
        </Box>
      </ScrollWrapper>
    </Drawer>
  )
}

export default SidebarLeft
