import { createSlice } from '@reduxjs/toolkit';

const requestSlice = createSlice({
  name: 'requests',
  initialState: {
    requests: [],
  },
  reducers: {
    setRequests: (state, action) => {
      state.requests = action.payload;
    },
  },
});

export const { setRequests } = requestSlice.actions;
export default requestSlice.reducer;
