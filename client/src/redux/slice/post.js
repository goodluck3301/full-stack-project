import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "../../axios"

// get request for get posts
export const fetchPost = createAsyncThunk('posts/fetchPosts', async () => {
    const { data } = await axios.get('/posts')
    return data
})

//get request for fetch tags
export const fetchTags = createAsyncThunk('posts/fetchTags', async () => {
    const { data } = await axios.get('/tags')
    return data
})

//delete request for delete post by id
export const fetchRemovePost = createAsyncThunk('posts/fetchRemovePost', async (id) => 
    await axios.delete(`/posts/${id}`) 
)

const initialState = {
    posts: {
        items: [],
        status: 'loading',
    },
    tags: {
        items: [],
        status: 'loading',
    },
}

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {},
    extraReducers:{
// Posts
        [fetchPost.pending]:(state)=>{
            state.posts.items = []
            state.posts.status = 'loading'
        },
        [fetchPost.fulfilled]:(state, action)=>{
            state.posts.items = action.payload
            state.posts.status = 'loaded'
        },
        [fetchPost.rejected]:(state)=>{
            state.posts.items = []
            state.posts.status = 'error'
        },

// Tags
        [fetchTags.pending]:(state)=>{
            state.tags.items = []
            state.tags.status = 'loading'
        },
        [fetchTags.fulfilled]:(state, action)=>{
            state.tags.items = action.payload
            state.tags.status = 'loaded'
        },
        [fetchTags.rejected]:(state)=>{
            state.tags.items = []
            state.tags.status = 'error'
        },

//Remove Post
        [fetchRemovePost.pending]:(state, action)=>{
            state.posts.items =
             state.posts.items
             .filter(obj=>obj._id !== action.meta.arg)
        },
    }
})

export const postReducer = postsSlice.reducer