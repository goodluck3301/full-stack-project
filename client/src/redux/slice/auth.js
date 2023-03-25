import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

// post method for login
export const fetchAuth = createAsyncThunk('auth/fetchUserData', async (params) => {
    const { data } = await axios.post('/auth/login', params)
    return data
})

// post method for registration
export const fetchRegister = createAsyncThunk('auth/fetchRegister', async (params) => {
    const { data } = await axios.post('/auth/register', params)
    return data
})

// get data about logined user
export const fetchAuthMe = createAsyncThunk('auth/fetchAuthMe', async (params) => {
    const { data } = await axios.get('/auth/me', params)
    return data
}) 

export const getUserById = async (id) => {
  try {
    const { data } = await axios.get(`/users/${id}`);
    return {
        fullName: data.fullName,
        avatarUrl: data.avatarUrl
    }
  } catch (error) {
    console.error(`Error fetching user data for ID ${id}: ${error}`);
    return null;
  }
};

const initialState = {
    data: null,
    status: 'loading',

    comments: {
        items: [],
        status: 'loading',
    },
}

const authSlince = createSlice({
    name:'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.data = null
        }
    },
    extraReducers: {

// fetchAuth state
        [fetchAuth.pending]:(state)=>{
            state.status = 'loading'
            state.data = null
        },
        [fetchAuth.fulfilled]:(state, action)=>{
            state.status = 'loaded'
            state.data = action.payload
        },
        [fetchAuth.rejected]:(state)=>{
            state.status = 'error'
            state.data = null
        },

// fetchAuthMe state
        [fetchAuthMe.pending]:(state)=>{
            state.status = 'loading'
            state.data = null
        },
        [fetchAuthMe.fulfilled]:(state, action)=>{
            state.status = 'loaded'
            state.data = action.payload
        },
        [fetchAuthMe.rejected]:(state)=>{
            state.status = 'error'
            state.data = null
        },

// fetchRegister state
        [fetchRegister.pending]:(state)=>{
            state.status = 'loading'
            state.data = null
        },
        [fetchRegister.fulfilled]:(state, action)=>{
            state.status = 'loaded'
            state.data = action.payload
        },
        [fetchRegister.rejected]:(state)=>{
            state.status = 'error'
            state.data = null
        },
    }
})

export const { logout } = authSlince.actions

export const selectIsAuth = (state) => Boolean(state.auth.data)

export const authReducer = authSlince.reducer

