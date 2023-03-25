import React, { useState } from "react";

import styles from "./AddComment.module.scss";

import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from '../../axios'
import { selectIsAuth } from "../../redux/slice/auth";

export const Index = () => {

  const {id} = useParams()
  const isAuth = useSelector(selectIsAuth)
  const [data, setData] = useState({})
  const [comment, setComment] = useState('');
  

  if(isAuth) {
    axios.get(`/auth/me`)
      .then(async ({ data }) => {
        setData(data)
      })
   }

   const handleCommentChange = (event) => 
      setComment(event.target.value);
  
  const onSubmit = (event) => {
    
    event.preventDefault();
    
    const postId = `${id}`; 
    axios.patch(`/posts/comment/${postId}`, { comment })
      .then(() => {
        setComment('')
      })
      .catch((error) => {
        console.error('Error adding comment:', error);
      });
  };
   
  return (
  <>
    {isAuth ? 
      (<div className={styles.root}>
        <Avatar
          classes={{ root: styles.avatar }}
          src = {`${data.avatarUrl}`}
        />
        <div className={styles.form}>
          <TextField
            label="Գրել Մեկնաբանություն"
            variant="outlined"
            maxRows={10}
            value={comment}
            onChange={handleCommentChange}
            multiline
            fullWidth
          />
          <Button variant="contained" onClick={onSubmit}>Ուղարկել</Button>
        </div>
      </div>)
      :(
        <></>
      )}
  </>
  )
}
