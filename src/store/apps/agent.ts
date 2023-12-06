// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import authConfig from 'src/configs/auth'

interface DataParams1 {
    pageId: number
    pageSize: number
}

// ** Fetch Data
export const fetchData = createAsyncThunk('appAgent/fetchData', async (params: DataParams1) => {
  
  const response = await axios.get(authConfig.backEndApi + '/address/isbroker/'+ `${params.pageId}` + '/'+params.pageSize)

  const NewData: any[] = response.data.data.filter((record: any) => record.id)
  response.data.data = NewData
  
  return response.data
})

export const appAgentSlice = createSlice({
  name: 'appAgent',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: [],
    allPages: 1,
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.data = action.payload.data
      state.total = action.payload.total
      state.params = action.payload.params
      state.allData = action.payload.data
      state.allPages = action.payload.allpages
    })
  }
})

export default appAgentSlice.reducer
