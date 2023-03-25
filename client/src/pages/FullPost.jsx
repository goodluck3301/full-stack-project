import React from "react";

import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import { useParams } from "react-router-dom";
import axios from "../axios";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";

export const FullPost = () => {
  const [data, setData] = React.useState()
  const [isLoading, setisLoading] = React.useState(true)
  const {id} = useParams()

  React.useEffect(() => {
    axios
    .get(`/posts/${id}`)
    .then(res => {
      setData(res.data)
      setisLoading(false)

    })
    .catch(err => alert(`${err} Տվյալնների ստացման սխալ`))
  }, [])

  if(isLoading)
    return <Post isLoading={isLoading} isFullPost/>

  const allComments = () => {
    const comments = data.comment || [];
    const commentItems = (comments.map((el) => {
      const user = getUserById(el.user);
      return {
        user: {
          fullName: "user.fullName",
          avatarUrl: "user.avatarUrl"
        },
        text: el.text
      };
    }));
    
    return commentItems;
  };

  return (
    <>
      <Post
        id={data.id}
        title={data.title}
        imageUrl={data.imageUrl?`http://localhost:4444${data.imageUrl}`:''}
        user={data.user}
        createdAt={data.createdAt}
        viewsCount={data.viewsCount}
        commentsCount={(data.comment).length}
        tags={data.tags}
        isFullPost
      >
      <ReactMarkdown children={data.text} />
      </Post>
      <CommentsBlock
       items={
        allComments()
        // [
        //   {
        //     user: {
        //       fullName: "Արամ Մանուկյան'",
        //       avatarUrl: "https://mui.com/static/images/avatar/1.jpg",
        //     },
        //     text: "Ես Արամ Մանուկյանն եմ",
        //   },
        //   {
        //     user: {
        //       fullName: "Արմեն Միրանյան",
        //       avatarUrl: "https://mui.com/static/images/avatar/2.jpg",
        //     },
        //     text: "Ես Արմեն Միրանյանն եմ",
        //   },
        // ]
      }
        isLoading={false}
      >
        <Index />
      </CommentsBlock>
    </>
  );
};

const getUserById = async (id) => {
  const { data } = await axios.get(`/users/${id}`)
    return data
}