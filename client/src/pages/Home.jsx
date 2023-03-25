import React from 'react';
import { useDispatch, useSelector, } from 'react-redux';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';

import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';

import {fetchPost, fetchTags} from '../redux/slice/post'
import { formatedDate } from '../utils/dateTime';

export const Home = () => {

  const dispatch = useDispatch()
  const userData = useSelector(state => state.auth.data)
  const {posts, tags} = useSelector(state => state.posts) 

  const isPostsLoading = posts.status === 'loading'
  const istagsLoading = tags.status === 'loading'

  React.useEffect(() => {
    dispatch(fetchPost())
    dispatch(fetchTags())
  }, [])

  return (
    <>
      <Tabs style={{ marginBottom: 15 }} value={0} aria-label="basic tabs example">
        <Tab label="Նորեր" />
        <Tab label="Հայտնիներ" />
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(isPostsLoading ? [...Array(5)] : posts.items).map((obj, index) => isPostsLoading ? (
            <Post key={index} isLoading={true}/>
            ) : (
              <Post
                _id={obj._id}
                title={obj.title}
                imageUrl={obj.imageUrl?`http://localhost:4444${obj.imageUrl}`:''}
                user={obj.user}
                createdAt={formatedDate(obj.createdAt)}
                viewsCount={obj.viewsCount}
                commentsCount={3}
                tags={obj.tags}
                isLoading = {false}
                isEditable={userData?._id === obj.user._id}
            />
            )
            )}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={istagsLoading} />
          <CommentsBlock
            items={[
              {
                user: {
                  fullName: 'Արամ Մանուկյան',
                  avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
                },
                text: 'Ես Արամ Մանուկյանն եմ',
              },
              {
                user: {
                  fullName: 'Արմեն Միրանյան',
                  avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',
                },
                text: 'Ես Արմեն Միրանյանն եմ',
              },
            ]}
            isLoading={false}
          />
        </Grid>
      </Grid>
    </>
  );
};

