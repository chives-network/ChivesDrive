// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

import authConfig from 'src/configs/auth'

import { TxRecordType } from 'src/types/apps/Chivesweave'

interface DataParams {
    address: string
    pageId: number
    pageSize: number
    type: string
}

// ** Fetch Data
export const fetchData = createAsyncThunk('appMyFiles/fetchData', async (params: DataParams) => {  
  const response = await axios.get(authConfig.backEndApi + '/file/'+ `${params.type}` + '/'+ `${params.address}` + '/'+ `${params.pageId}` + '/'+params.pageSize)
  const NewData: any[] = response.data.data.filter((record: any) => record.id)
  response.data.data = NewData
  
  return { ...response.data, filter: params }
})

export const setCurrentFile = createAsyncThunk('appDrive/selectFile', async (FileTx: TxRecordType) => {

  return FileTx
})

export const updateFileLabel = createAsyncThunk('appDrive/updateFileLabel', async (FileTx: TxRecordType) => {

  return FileTx
})

export const appDriveSlice = createSlice({
  name: 'appDrive',
  initialState: {
    files: null,
    mailMeta: null,
    filter: {
      q: '',
      label: '',
      type: '',
      folder: 'myfiles'
    },
    currentFile: {},
    selectedFiles: [],
    
    data: [],
    total: 1,
    params: {},
    allData: [],
    allPages: 1,
  },
  reducers: {
    handleSelectFile: (state, action) => {
      const files: any = state.selectedFiles
      if (!files.includes(action.payload)) {
        files.push(action.payload)
      } else {
        files.splice(files.indexOf(action.payload), 1)
      }
      state.selectedFiles = files
    },
    handleSelectAllFile: (state, action) => {
      const selectAllDrives: string[] = []
      if (action.payload && state.files !== null) {
        selectAllDrives.length = 0

        // @ts-ignore
        state.data.forEach((drive: TxRecordType) => selectAllDrives.push(drive.id))
      } else {
        selectAllDrives.length = 0
      }
      state.selectedFiles = selectAllDrives as any
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.files = action.payload.emails
      state.filter = action.payload.filter
      state.mailMeta = action.payload.emailsMeta

      
      state.data = action.payload.data
      state.total = action.payload.total
      state.params = action.payload.params
      state.allData = action.payload.data
      state.allPages = action.payload.allpages

    })
    builder.addCase(setCurrentFile.fulfilled, (state, action) => {
      state.currentFile = action.payload
    })
  }
})

export const { handleSelectFile, handleSelectAllFile } = appDriveSlice.actions

export default appDriveSlice.reducer
