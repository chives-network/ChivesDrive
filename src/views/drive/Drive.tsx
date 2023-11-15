// ** React Imports
import { useState, useEffect } from 'react'

// ** Redux Imports
import { useDispatch, useSelector } from 'react-redux'

// ** MUI Imports
import Box from '@mui/material/Box'
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
import UploadFiles from 'src/views/form/uploadfiles';

import CardContent from '@mui/material/CardContent'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

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

// ** Variables
const labelColors: MailLabelColors = {
  private: 'error',
  personal: 'success',
  company: 'primary',
  important: 'warning'
}

const DriveAppLayout = ({ folder, label, type }: MailLayoutType) => {
  // ** Hook
  const { t } = useTranslation()
  
  // ** States
  const [query, setQuery] = useState<string>('')
  const [uploadFilesOpen, setUploadFilesOpen] = useState<boolean>(false)
  const [uploadFilesTitle, setUploadFilesTitle] = useState<string>("Upload Files")
  const [mailDetailsOpen, setMailDetailsOpen] = useState<boolean>(false)
  const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(false)

  // ** Hooks
  const theme = useTheme()
  const { settings } = useSettings()
  const dispatch = useDispatch<AppDispatch>()
  const lgAbove = useMediaQuery(theme.breakpoints.up('lg'))
  const hidden = useMediaQuery(theme.breakpoints.down('lg'))
  const store = useSelector((state: RootState) => state.drive)

  // ** Vars
  const leftSidebarWidth = 260
  const { skin, direction } = settings
  const routeParams = {
    label: label || '',
    type: type || 'png',
    folder: folder || 'myfiles'
  }

  const auth = useAuth()

  const id = auth.currentAddress

  // ** State
  const [paginationModel, setPaginationModel] = useState({ page: 1, pageSize: 9 })
  
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
          type: type
        })
      )
      setUploadFilesOpen(false)
      setUploadFilesTitle("Upload Files")
    }
  }, [dispatch, paginationModel, type, id])

  const toggleUploadFilesOpen = () => {
    setUploadFilesOpen(!uploadFilesOpen)
    if(uploadFilesOpen) {
      setUploadFilesTitle("Upload Files")
    }
    else {
      setUploadFilesTitle("Back To List")
    }
  }
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
        routeParams={routeParams}
        mailDetailsOpen={mailDetailsOpen}
        leftSidebarOpen={leftSidebarOpen}
        leftSidebarWidth={leftSidebarWidth}
        uploadFilesTitle={uploadFilesTitle}
        toggleUploadFilesOpen={toggleUploadFilesOpen}
        setMailDetailsOpen={setMailDetailsOpen}
        handleSelectAllMail={handleSelectAllMail}
        handleLeftSidebarToggle={handleLeftSidebarToggle}
      />
      { !uploadFilesOpen ?
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
        :
        <CardContent>
          <UploadFiles />
        </CardContent>
      }
    </Box>
  )
}

export default DriveAppLayout
