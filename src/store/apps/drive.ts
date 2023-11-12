// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

// ** Types
import { Dispatch } from 'redux'
import {
  MailType,
  UpdateMailLabelType,
  FetchMailParamsType,
  UpdateMailParamsType,
  PaginateMailParamsType
} from 'src/types/apps/emailTypes'

interface ReduxType {
  getState: any
  dispatch: Dispatch<any>
}

import authConfig from 'src/configs/auth'

interface DataParams1 {
    address: string
    pageId: number
    pageSize: number
    type: string
}

// ** Fetch Data
export const fetchData = createAsyncThunk('appMyFiles/fetchData', async (params: DataParams1) => {
  
  const response = await axios.get(authConfig.backEndApi + '/file/'+ `${params.type}` + '/'+ `${params.address}` + '/'+ `${params.pageId}` + '/'+params.pageSize)

  const NewData: any[] = response.data.data.filter((record: any) => record.id)
  response.data.data = NewData
  
  return { ...response.data, filter: params }
})


// ** Get Current Mail
export const getCurrentMail = createAsyncThunk('appEmail/selectMail', async (id: number | string) => {
  const response = await axios.get('/apps/email/get-email', {
    params: {
      id
    }
  })

  return response.data
})

// ** Update Mail
export const updateMail = createAsyncThunk(
  'appEmail/updateMail',
  async (params: UpdateMailParamsType, { dispatch, getState }: ReduxType) => {
    const response = await axios.post('/apps/email/update-emails', {
      data: { emailIds: params.emailIds, dataToUpdate: params.dataToUpdate }
    })

    await dispatch(fetchData(getState().email.filter))
    if (Array.isArray(params.emailIds)) {
      await dispatch(getCurrentMail(params.emailIds[0]))
    }

    return response.data
  }
)

// ** Update Mail Label
export const updateMailLabel = createAsyncThunk(
  'appEmail/updateMailLabel',
  async (params: UpdateMailLabelType, { dispatch, getState }: ReduxType) => {
    const response = await axios.post('/apps/email/update-emails-label', {
      data: { emailIds: params.emailIds, label: params.label }
    })

    await dispatch(fetchData(getState().email.filter))

    if (Array.isArray(params.emailIds)) {
      await dispatch(getCurrentMail(params.emailIds[0]))
    }

    return response.data
  }
)

// ** Prev/Next Mails
export const paginateMail = createAsyncThunk('appEmail/paginateMail', async (params: PaginateMailParamsType) => {
  const response = await axios.get('/apps/email/paginate-email', { params })

  return response.data
})

export const appEmailSlice = createSlice({
  name: 'appEmail',
  initialState: {
    mails: null,
    mailMeta: null,
    filter: {
      q: '',
      label: '',
      folder: 'inbox'
    },
    currentMail: null,
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
        state.data.forEach((drive: MailType) => selectAllDrives.push(drive.id))
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
    builder.addCase(getCurrentMail.fulfilled, (state, action) => {
      state.currentMail = action.payload
    })
    builder.addCase(paginateMail.fulfilled, (state, action) => {
      state.currentMail = action.payload
    })
  }
})

export const { handleSelectMail, handleSelectAllMail } = appEmailSlice.actions

export default appEmailSlice.reducer
