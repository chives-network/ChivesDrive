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

export const getCurrentFile = createAsyncThunk('appDrive/selectFile', async (FileTx: TxRecordType) => {

  return FileTx
})

export const updateFile = createAsyncThunk('appDrive/updateFile', async (FileTx: TxRecordType) => {

  return FileTx
})

export const updateFileLabel = createAsyncThunk('appDrive/updateFileLabel', async (FileTx: TxRecordType) => {

  return FileTx
})

export const appEmailSlice = createSlice({
  name: 'appDrive',
  initialState: {
    mails: null,
    mailMeta: null,
    filter: {
      q: '',
      label: '',
      type: '',
      folder: 'myfiles'
    },
    currentFile: {},
    selectedMails: [],
    
    data: [],
    total: 1,
    params: {},
    allData: [],
    allPages: 1,
  },
  reducers: {
    handleSelectMail: (state, action) => {
      const mails: any = state.selectedMails
      if (!mails.includes(action.payload)) {
        mails.push(action.payload)
      } else {
        mails.splice(mails.indexOf(action.payload), 1)
      }
      state.selectedMails = mails
    },
    handleSelectAllMail: (state, action) => {
      const selectAllDrives: number[] = []
      if (action.payload && state.mails !== null) {
        selectAllDrives.length = 0

        // @ts-ignore
        state.data.forEach((drive: TxRecordType) => selectAllDrives.push(drive.id))
      } else {
        selectAllDrives.length = 0
      }
      state.selectedMails = selectAllDrives as any
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.mails = action.payload.emails
      state.filter = action.payload.filter
      state.mailMeta = action.payload.emailsMeta

      
      state.data = action.payload.data
      state.total = action.payload.total
      state.params = action.payload.params
      state.allData = action.payload.data
      state.allPages = action.payload.allpages

    })
    builder.addCase(getCurrentFile.fulfilled, (state, action) => {
      state.currentFile = action.payload
    })
  }
})

export const { handleSelectMail, handleSelectAllMail } = appEmailSlice.actions

export default appEmailSlice.reducer
