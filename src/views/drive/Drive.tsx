// ** React Imports
import { useState, useEffect } from 'react'

// ** Redux Imports
import { useDispatch, useSelector } from 'react-redux'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Types
import { RootState, AppDispatch } from 'src/store'
import { MailLayoutType, MailLabelColors } from 'src/types/apps/emailTypes'

// ** Email App Component Imports
import DriveList from 'src/views/drive/DriveList'
import SidebarLeft from 'src/views/drive/SidebarLeft'
import ComposePopup from 'src/views/drive/UploadFiles'

// ** Actions
import {
  fetchData,
  updateMail,
  paginateMail,
  getCurrentMail,
  updateMailLabel,
  handleSelectMail,
  handleSelectAllMail
} from 'src/store/apps/drive'


// ** Context
import { useAuth } from 'src/hooks/useAuth'

// ** Axios Imports
import axios from 'axios'

import Pagination from '@mui/material/Pagination'

// ** Next Import
import { useRouter } from 'next/router'

// ** Variables
const labelColors: MailLabelColors = {
  private: 'error',
  personal: 'success',
  company: 'primary',
  important: 'warning'
}

const DriveAppLayout = ({ folder, label }: MailLayoutType) => {
  // ** States
  const [query, setQuery] = useState<string>('')
  const [composeOpen, setComposeOpen] = useState<boolean>(false)
  const [mailDetailsOpen, setMailDetailsOpen] = useState<boolean>(false)
  const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(false)

  // ** Hooks
  const theme = useTheme()
  const { settings } = useSettings()
  const dispatch = useDispatch<AppDispatch>()
  const lgAbove = useMediaQuery(theme.breakpoints.up('lg'))
  const mdAbove = useMediaQuery(theme.breakpoints.up('md'))
  const smAbove = useMediaQuery(theme.breakpoints.up('sm'))
  const hidden = useMediaQuery(theme.breakpoints.down('lg'))
  const store = useSelector((state: RootState) => state.drive)

  // ** Vars
  const leftSidebarWidth = 260
  const { skin, direction } = settings
  const composePopupWidth = mdAbove ? 754 : smAbove ? 520 : '100%'
  const routeParams = {
    label: label || '',
    folder: folder || 'myfiles'
  }

  const activeTab = "png"

  const router = useRouter();

  const auth = useAuth()

  const id = auth.currentAddress

  // ** State
  const [isLoading, setIsLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ page: 1, pageSize: 9 })
  
  const [addressBalance, setAddressBalance] = useState<string>('')

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setPaginationModel({ ...paginationModel, page });
    console.log("handlePageChange", event)
  }

  useEffect(() => {
    if(true && id && id.length == 43) {
      dispatch(
        fetchData({
          address: String(id),
          pageId: paginationModel.page - 1,
          pageSize: paginationModel.pageSize,
          type: activeTab
        })
      )
    }
  }, [dispatch, paginationModel, activeTab, id])

  console.log("store", store)

  const toggleComposeOpen = () => setComposeOpen(!composeOpen)
  const handleLeftSidebarToggle = () => setLeftSidebarOpen(!leftSidebarOpen)

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        borderRadius: 1,
        overflow: 'hidden',
        position: 'relative',
        boxShadow: skin === 'bordered' ? 0 : 6,
        ...(skin === 'bordered' && { border: `1px solid ${theme.palette.divider}` })
      }}
    >
      <SidebarLeft
        store={store}
        hidden={hidden}
        lgAbove={lgAbove}
        dispatch={dispatch}
        mailDetailsOpen={mailDetailsOpen}
        leftSidebarOpen={leftSidebarOpen}
        leftSidebarWidth={leftSidebarWidth}
        toggleComposeOpen={toggleComposeOpen}
        setMailDetailsOpen={setMailDetailsOpen}
        handleSelectAllMail={handleSelectAllMail}
        handleLeftSidebarToggle={handleLeftSidebarToggle}
      />
      <DriveList
        query={query}
        store={store}
        hidden={hidden}
        lgAbove={lgAbove}
        dispatch={dispatch}
        setQuery={setQuery}
        direction={direction}
        updateMail={updateMail}
        routeParams={routeParams}
        labelColors={labelColors}
        paginateMail={paginateMail}
        getCurrentMail={getCurrentMail}
        updateMailLabel={updateMailLabel}
        mailDetailsOpen={mailDetailsOpen}
        handleSelectMail={handleSelectMail}
        setMailDetailsOpen={setMailDetailsOpen}
        handleSelectAllMail={handleSelectAllMail}
        handleLeftSidebarToggle={handleLeftSidebarToggle}
        
        paginationModel={paginationModel}
        handlePageChange={handlePageChange}
      />
      <ComposePopup
        mdAbove={mdAbove}
        composeOpen={composeOpen}
        composePopupWidth={composePopupWidth}
        toggleComposeOpen={toggleComposeOpen}
      />
    </Box>
  )
}

export default DriveAppLayout
